This is Ethglobal Brussels 2024 project

### Issues

Currently, biometric authentication primarily uses facial recognition and fingerprint recognition. We can now utilize user voice authentication for encryption and store it on the blockchain, allowing direct login to the wallet for on-chain operations.

WalletConnect currently only supports QR code verification. We can have two methods:

1. Use voice authentication as 2FA. After voice verification, use QR code verification.
2. Directly use the encrypted voice as the private key to log in to WalletConnect.

Using our method can significantly improve the user experience, allowing users to interact with the wallet immediately after verification.

###
Workflow:
1. Registration
User Registers: User begins the registration process on the application.
Record Voice: The application prompts the user to record their voice.
Extract Voiceprint: The recorded voice is processed to extract a voiceprint.
Store Voiceprint on IPFS: The extracted voiceprint is stored on IPFS, and an IPFS hash is generated.
Store IPFS Hash on Blockchain: The application requests the user to confirm a transaction using their wallet (e.g., MetaMask) to store the IPFS hash on the blockchain.
2. Login
User Logs In: User initiates the login process on the application.
Record Voice: The application prompts the user to record their voice.
Get Stored Voiceprint IPFS Hash from Blockchain: The application retrieves the IPFS hash of the registered voiceprint from the blockchain.
Download Stored Voiceprint from IPFS: Using the IPFS hash, the application downloads the registered voiceprint from IPFS.
Extract and Compare Voiceprints: The recorded voiceprint from the login process is extracted and compared with the downloaded registered voiceprint.
Compare Voiceprints:
If the voiceprints match (within a defined threshold):
Success: The user is authenticated, and the wallet login QR code is displayed or scanned.
If the voiceprints do not match:
Failure: The user is rejected, and an appropriate message is displayed.
Implementation Steps
1. Frontend (React)
Record Voice: Use the VoiceRecorder component to record the voice.
Upload to IPFS and Store Hash on Blockchain: Prompt the user to confirm the transaction using MetaMask to store the IPFS hash on the blockchain during registration.
Retrieve Hash and Compare: During login, retrieve the IPFS hash from the blockchain and compare the recorded voiceprint with the stored voiceprint.
2. Backend (Django)
Extract Voiceprint: Process the recorded voice to extract the voiceprint.
Handle IPFS and Blockchain Interaction: Handle storing and retrieving the IPFS hash and voiceprints, and perform the comparison.

### Run it

run backend server

```
pip install -r requirements.txt
```

```
python3 manage.py runserver
```

run frontend

```
bun i
```

```
bun run start
```

port: localhost:3000
