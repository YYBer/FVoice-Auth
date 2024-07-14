This is Ethglobal Brussels 2024 project

1. Generate a Voiceprint
2. Store the Encrypted Voiceprint in the IPFS Calibration and used ZK-SNARKs to protect authenticity and privacy.
3. Integrate with WalletConnect

###

Use a pyAudio and library to extract features such as Mel-Frequency Cepstral Coefficients (MFCCs) from the voice sample.

Use the Voiceprint for Authentication:

1. Detect if the specified text is spoken in speech
2. Detect if it is the same person's voiceprint
3. Storing and Comparing Voiceprints
4. Directly open walletConnect to let user scan QRcode
5. Integrate OpenAI whisper transform user voice to text, if we detect key word than execute action

###

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
