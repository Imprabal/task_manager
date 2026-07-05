import os
import logging
import threading

log = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_sound = os.environ.get("ALARM_SOUND")
if env_sound:
    ALARM_SOUND = env_sound
else:
    mp3_path = os.path.join(BASE_DIR, "east_duo.mp3")
    wav_path = os.path.join(BASE_DIR, "alarm.wav")
    if os.path.exists(mp3_path):
        ALARM_SOUND = mp3_path
    elif os.path.exists(wav_path):
        ALARM_SOUND = wav_path
    else:
        ALARM_SOUND = mp3_path


_aplay_process = None


def stop_alarm() -> None:
    global _aplay_process
    log.info("Attempting to stop alarm sound...")
    try:
        import pygame
        if pygame.mixer.get_init():
            pygame.mixer.music.stop()
            log.info("Stopped pygame music.")
    except Exception as e:
        pass

    if _aplay_process is not None:
        try:
            _aplay_process.terminate()
            log.info("Terminated aplay process.")
        except Exception:
            pass
        _aplay_process = None


def _play_sound() -> None:
    if not os.path.isfile(ALARM_SOUND):
        log.warning(
            f"Alarm sound file not found at '{ALARM_SOUND}'."
        )
        return

    import subprocess
    import shutil

    
    try:
        log.info(f"Playing sound via pygame: {ALARM_SOUND}")
        import pygame
        pygame.mixer.init()
        pygame.mixer.music.load(ALARM_SOUND)
        pygame.mixer.music.play()
        
        # Wait for the sound to finish playing
        import time
        while pygame.mixer.music.get_busy():
            time.sleep(1)
            
        log.info("Alarm sound played via pygame successfully.")
        return
    except Exception as exc:
        log.warning(f"pygame failed: {exc}. Trying other methods...")

    
    if ALARM_SOUND.lower().endswith(".wav") and shutil.which("aplay"):
        try:
            log.info(f"Playing sound via aplay: {ALARM_SOUND}")
            global _aplay_process
            _aplay_process = subprocess.Popen(["aplay", ALARM_SOUND])
            _aplay_process.wait()
            log.info("Alarm sound played via aplay successfully.")
            return
        except Exception as e:
            log.warning(f"aplay failed: {e}. Trying playsound...")

    
    try:
        log.info(f"Playing sound via playsound: {ALARM_SOUND}")
        from playsound import playsound
        playsound(ALARM_SOUND)
        log.info("Alarm sound played via playsound successfully.")
    except Exception as exc:
        log.error(f"Failed to play alarm sound via playsound: {exc}")


def _send_notification(task_name: str) -> None:
    try:
        from plyer import notification
        notification.notify(
            title="📚 Study Alarm",
            message=f"Time for your lecture: {task_name}",
            app_name="Study Task Manager",
            timeout=10,
        )
        log.info(f"Desktop notification sent for '{task_name}'.")
    except Exception as exc:
        log.error(f"Failed to send desktop notification: {exc}")


def trigger_alarm(task_id: int, task_name: str) -> None:
    log.info(f"🔔 ALARM triggered — task_id={task_id}, name='{task_name}'")

    t_notif = threading.Thread(target=_send_notification, args=(task_name,), daemon=True)
    t_sound = threading.Thread(target=_play_sound, daemon=True)

    t_notif.start()
    t_sound.start()

    t_notif.join(timeout=15)
    t_sound.join(timeout=60)
