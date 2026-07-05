# 📚 Study Task Manager

A local-first Study Task Manager that runs in your browser and tightly integrates with your desktop OS to trigger native system alarms and notifications for daily lectures and tasks.

## ✨ Features

- **Local-First & Private:** All your tasks are saved locally in an SQLite database.
- **Native OS Notifications:** Uses Python's `plyer` to trigger native desktop notifications when it's time for a task.
- **Audio Alarms:** Plays an alarm sound locally on your machine at the scheduled time.
- **Modern Interface:** A sleek and responsive React frontend built with Vite and Tailwind CSS.
- **Task Management:** Create, update, delete, and toggle tasks. Test your alarms on the fly!

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Axios, React Hot Toast
- **Backend:** Python 3, Flask, SQLite3, Schedule, Plyer

---

## 🚀 Getting Started

Follow these steps to get the project running locally on your machine.

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:
```bash
cd backend
```

**(Optional but recommended) Create and activate a virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Linux/macOS
# .\venv\Scripts\activate # On Windows
```

**Install the Python dependencies:**
```bash
pip install -r requirements.txt
```

**Start the Flask Server:**
```bash
python app.py
```
*(The backend will start on `http://localhost:5000`)*

---

### 2. Frontend Setup

Open a **new** terminal window and navigate to the `frontend` directory:
```bash
cd frontend
```

**Install the dependencies:**
```bash
npm install
```

**Start the React Development Server:**
```bash
npm run dev
```
*(The frontend will start on `http://localhost:5173`)*

---

## 🎮 Usage

1. Open `http://localhost:5173` in your web browser.
2. Add your daily lectures or study tasks and set their alarm times (HH:MM).
3. Toggle tasks on or off as needed.
4. Keep the backend terminal running in the background. At the exact scheduled time, your desktop will fire a native notification and play your alarm sound!

## 📁 Project Structure

```text
Task Manager/
├── backend/
│   ├── app.py              # Main Flask server
│   ├── database.py         # SQLite initialization and connection
│   ├── notifications.py    # Alarm audio and desktop notification logic
│   ├── requirements.txt    # Python dependencies
│   └── tasks.db            # Local SQLite database
└── frontend/
    ├── src/                # React source code (components, styles, etc.)
    ├── package.json        # Node.js dependencies
    ├── tailwind.config.js  # Tailwind styling configurations
    └── vite.config.js      # Vite build configurations
```

---
*Built with ❤️ for focused studying.*
