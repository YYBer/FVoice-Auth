This is Ethglobal Brussels 2024 project

1. Generate a Voiceprint
2. Store the Encrypted Voiceprint in the IPFS Calibration and used ZK-SNARKs to protect authenticity and privacy.
3. Integrate with WalletConnect

### Issues

Currently, biometric authentication primarily uses facial recognition and fingerprint recognition. We can now utilize user voice authentication for encryption and store it on the blockchain, allowing direct login to the wallet for on-chain operations.

WalletConnect currently only supports QR code verification. We can have two methods:

1. Use voice authentication as 2FA. After voice verification, use QR code verification.
2. Directly use the encrypted voice as the private key to log in to WalletConnect.

Using our method can significantly improve the user experience, allowing users to interact with the wallet immediately after verification.

###

Use a pyAudio and library to extract features such as Mel-Frequency Cepstral Coefficients (MFCCs) from the voice sample.

Use the Voiceprint for Authentication:

1. Detect if the specified text is spoken in speech
2. Detect if it is the same person's voiceprint
3. Storing after encrypt and Comparing encrypted Voiceprints
4. Directly open walletConnect to let user scan QRcode
5. Integrate OpenAI whisper transform user voice to text after successfully compare user voice encrypted data, if we detect swap key word than execute swap connect with 1inch

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
