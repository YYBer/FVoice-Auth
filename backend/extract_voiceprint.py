import librosa
import numpy as np

def extract_mfcc(file_path, n_mfcc=13):
    # Load the audio file
    y, sr = librosa.load(file_path, sr=None)
    
    # Extract MFCC features
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    
    # Compute the mean of the MFCC features
    mfccs_mean = np.mean(mfccs.T, axis=0)
    
    return mfccs_mean

# Usage example
if __name__ == "__main__":
    # file_path = "output4.wav"
    file_path = sys.argv[1]
    mfcc_features = extract_mfcc(file_path)
    np.save("voiceprint.npy", mfcc_features)
    print(f"Extracted MFCC features: {mfcc_features}")
