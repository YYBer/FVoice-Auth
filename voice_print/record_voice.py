# import librosa
# import numpy as np

# def extract_voiceprint(audio_path):
#     y, sr = librosa.load(audio_path, sr=None)
#     mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
#     voiceprint = np.mean(mfccs.T, axis=0)
#     return voiceprint


import pyaudio
import wave

def record_voice(output_file, record_seconds=5, sample_rate=44100, chunk_size=1024, channels=1):
    # Initialize PyAudio
    audio = pyaudio.PyAudio()

    # Open the stream
    stream = audio.open(format=pyaudio.paInt16,
                        channels=channels,
                        rate=sample_rate,
                        input=True,
                        frames_per_buffer=chunk_size)

    print("Recording...")

    # Store the recorded frames
    frames = []

    for _ in range(0, int(sample_rate / chunk_size * record_seconds)):
        data = stream.read(chunk_size)
        frames.append(data)

    print("Recording finished.")

    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    audio.terminate()

    # Save the recorded data to a WAV file
    with wave.open(output_file, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
        wf.setframerate(sample_rate)
        wf.writeframes(b''.join(frames))

# Usage example
if __name__ == "__main__":
    record_voice("output.wav", record_seconds=5)
