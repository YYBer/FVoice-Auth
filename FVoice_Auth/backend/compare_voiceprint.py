import numpy as np

def compare_voiceprints(voiceprint1, voiceprint2, threshold=15):
    distance = np.linalg.norm(voiceprint1 - voiceprint2)
    print(distance)
    return distance < threshold

# Load the stored voiceprint
stored_voiceprint = np.load("old_voiceprint.npy")

# Extract the voiceprint from a new recording
new_voiceprint = np.load("new_voiceprint.npy")

# Compare the new voiceprint with the stored voiceprint
if compare_voiceprints(stored_voiceprint, new_voiceprint):
    print("Voice authentication successful.")
else:
    print("Voice authentication failed.")
