import librosa
import numpy as np
import base64
import sys

def extract_mfcc(file_path, n_mfcc=13):
    y, sr = librosa.load(file_path, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    mfccs_mean = np.mean(mfccs.T, axis=0)
    return mfccs_mean

if __name__ == "__main__":
    file_path = sys.argv[1]  # Accept file path as an argument
    mfcc_features = extract_mfcc(file_path)
    
    # Convert the numpy array to a base64 string
    mfcc_base64 = base64.b64encode(mfcc_features).decode('utf-8')
    
    # Print the base64 string to be captured by subprocess
    print(mfcc_base64)
