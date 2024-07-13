import numpy as np

def compare_voiceprints(voiceprint1, voiceprint2, threshold=15):
    """
    Compare two voiceprints using Euclidean distance.
    
    :param voiceprint1: First voiceprint (numpy array)
    :param voiceprint2: Second voiceprint (numpy array)
    :param threshold: Distance threshold for authentication
    :return: True if the voiceprints match, False otherwise
    """
    distance = np.linalg.norm(voiceprint1 - voiceprint2)
    print(distance)
    return distance < threshold

# Load the stored voiceprint
stored_voiceprint = np.load("voiceprint1.npy")

# Extract the voiceprint from a new recording
new_voiceprint = np.load("voiceprint4.npy")

# Compare the new voiceprint with the stored voiceprint
if compare_voiceprints(stored_voiceprint, new_voiceprint):
    print("Voice authentication successful.")
else:
    print("Voice authentication failed.")
