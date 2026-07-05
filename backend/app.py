import os
import threading
import time
import datetime
import logging

from flask import Flask, jsonify, request
from flask_cors import CORS

import schedule

from database import init_db, get_db_connection
from notifications import trigger_alarm, stop_alarm

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

init_db()


def run_scheduler():
    log.info("Scheduler thread started.")
    while True:
        schedule.run_pending()
        time.sleep(10)


def rebuild_schedule():
    schedule.clear()
    conn = get_db_connection()
    tasks = conn.execute(
        "SELECT * FROM tasks WHERE enabled = 1"
    ).fetchall()
    conn.close()

    for task in tasks:
        task_time = task["alarm_time"]
        task_id   = task["id"]
        task_name = task["name"]

        schedule.every().day.at(task_time).do(
            trigger_alarm, task_id=task_id, task_name=task_name
        )
        log.info(f"Scheduled '{task_name}' (id={task_id}) at {task_time} daily.")

    log.info(f"Schedule rebuilt — {len(tasks)} active job(s).")


rebuild_schedule()

scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
scheduler_thread.start()


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    conn = get_db_connection()
    tasks = conn.execute(
        "SELECT * FROM tasks ORDER BY alarm_time ASC"
    ).fetchall()
    conn.close()
    return jsonify([dict(t) for t in tasks])


@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json()
    name       = data.get("name", "").strip()
    alarm_time = data.get("alarm_time", "").strip()

    if not name or not alarm_time:
        return jsonify({"error": "Both 'name' and 'alarm_time' are required."}), 400

    try:
        datetime.datetime.strptime(alarm_time, "%H:%M")
    except ValueError:
        return jsonify({"error": "Invalid time format. Use HH:MM (24-hour)."}), 400

    conn = get_db_connection()
    cursor = conn.execute(
        "INSERT INTO tasks (name, alarm_time, enabled) VALUES (?, ?, 1)",
        (name, alarm_time),
    )
    conn.commit()
    new_id = cursor.lastrowid

    task = conn.execute(
        "SELECT * FROM tasks WHERE id = ?", (new_id,)
    ).fetchone()
    conn.close()

    rebuild_schedule()
    log.info(f"Task created: '{name}' at {alarm_time}")
    return jsonify(dict(task)), 201


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json()
    conn = get_db_connection()

    existing = conn.execute(
        "SELECT * FROM tasks WHERE id = ?", (task_id,)
    ).fetchone()
    if not existing:
        conn.close()
        return jsonify({"error": "Task not found."}), 404

    name       = data.get("name",       existing["name"])
    alarm_time = data.get("alarm_time", existing["alarm_time"])
    enabled    = data.get("enabled",    existing["enabled"])

    if "alarm_time" in data:
        try:
            datetime.datetime.strptime(alarm_time, "%H:%M")
        except ValueError:
            conn.close()
            return jsonify({"error": "Invalid time format. Use HH:MM."}), 400

    conn.execute(
        "UPDATE tasks SET name = ?, alarm_time = ?, enabled = ? WHERE id = ?",
        (name, alarm_time, enabled, task_id),
    )
    conn.commit()

    updated = conn.execute(
        "SELECT * FROM tasks WHERE id = ?", (task_id,)
    ).fetchone()
    conn.close()

    rebuild_schedule()
    log.info(f"Task id={task_id} updated: enabled={enabled}")
    return jsonify(dict(updated))


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    conn = get_db_connection()
    existing = conn.execute(
        "SELECT * FROM tasks WHERE id = ?", (task_id,)
    ).fetchone()
    if not existing:
        conn.close()
        return jsonify({"error": "Task not found."}), 404

    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()

    rebuild_schedule()
    log.info(f"Task id={task_id} deleted.")
    return jsonify({"message": f"Task {task_id} deleted successfully."})


@app.route("/api/test-alarm/<int:task_id>", methods=["POST"])
def test_alarm(task_id):
    conn = get_db_connection()
    task = conn.execute(
        "SELECT * FROM tasks WHERE id = ?", (task_id,)
    ).fetchone()
    conn.close()

    if not task:
        return jsonify({"error": "Task not found."}), 404

    threading.Thread(
        target=trigger_alarm,
        kwargs={"task_id": task_id, "task_name": task["name"]},
        daemon=True,
    ).start()

    return jsonify({"message": f"Test alarm triggered for '{task['name']}'."})


@app.route("/api/stop-alarm", methods=["POST"])
def stop_alarm_endpoint():
    stop_alarm()
    return jsonify({"message": "Alarm stopped."})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "scheduler_jobs": len(schedule.jobs)})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
