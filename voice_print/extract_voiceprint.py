import librosa
import numpy as np

def extract_mfcc(file_path, n_mfcc=13):
    """
    Extract MFCC features from an audio file and return the mean of the MFCCs.
    
    :param file_path: Path to the input WAV file
    :param n_mfcc: Number of MFCCs to return
    :return: Mean of the MFCC features
    """
    # Load the audio file
    y, sr = librosa.load(file_path, sr=None)
    
    # Extract MFCC features
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    
    # Compute the mean of the MFCC features
    mfccs_mean = np.mean(mfccs.T, axis=0)
    
    return mfccs_mean

# Usage example
if __name__ == "__main__":
    file_path = "output4.wav"
    mfcc_features = extract_mfcc(file_path)
    np.save("voiceprint5.npy", mfcc_features)
    print(f"Extracted MFCC features: {mfcc_features}")
