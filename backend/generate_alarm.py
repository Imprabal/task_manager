import math
import struct
import wave
import os

def generate_default_alarm():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(base_dir, "alarm.wav")
    
    sample_rate = 44100.0
    duration = 2.5
    num_samples = int(duration * sample_rate)
    amplitude = 16000

    print(f"Generating default ringtone to {output_path}...")
    
    with wave.open(output_path, "w") as wav_file:
        wav_file.setparams((1, 2, int(sample_rate), num_samples, "NONE", "not compressed"))
        
        for i in range(num_samples):
            t = i / sample_rate
            cycle = t % 0.4
            if cycle < 0.3:
                value = int(amplitude * math.sin(2.0 * math.pi * 880.0 * t))
            else:
                value = 0
                
            data = struct.pack("<h", value)
            wav_file.writeframesraw(data)
            
    print("Done! Default 'alarm.wav' ringtone created.")

if __name__ == "__main__":
    generate_default_alarm()
