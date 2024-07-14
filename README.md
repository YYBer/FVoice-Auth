This is Ethglobal Brussels 2024 project

1. Generate a Voiceprint
2. Store the Encrypted Voiceprint in the IPFS and used ZK-SNARKs to protect authenticity and privacy.
3. Integrate with 1inch or Worldcoin ID



###
Use a pyAudio and librosa to extract features such as Mel-Frequency Cepstral Coefficients (MFCCs) from the voice sample.

Use the Voiceprint for Authentication:
1:Detect if the specified text is spoken in speech 2:Detect if it is the same person's voiceprint
Storing and Comparing Voiceprints

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