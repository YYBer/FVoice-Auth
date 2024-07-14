// import React, { useState, useRef } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import { ethers } from 'ethers';

const VoiceRecorder = ({ isRegistered, onRegister }) => {
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        setLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
                audioChunks.current = [];

                // Convert audioBlob to base64 string
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64String = reader.result.split(',')[1];

                    try {
                        setLoading(true);
                        let response;
                        if (isRegistered) {
                            const userAddress = await window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => accounts[0]);
                            response = await axios.post('http://127.0.0.1:8000/compare_voiceprint/', { voice_sample: base64String, user_address: userAddress });
                            console.log('Response:', response.data);
                            if (response.data.result === 'Voice authentication successful.') {
                                // Open wallet
                                console.log('Opening wallet...');
                            }
                        } else {
                            // Store voiceprint on IPFS and get the hash
                            const formData = new FormData();
                            formData.append('file', audioBlob, 'voiceprint.wav');
                            const ipfsResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'pinata_api_key': '<YOUR_PINATA_API_KEY>',
                                    'pinata_secret_api_key': '<YOUR_PINATA_SECRET_API_KEY>'
                                }
                            });
                            const ipfsHash = ipfsResponse.data.IpfsHash;

                            // Request wallet to store IPFS hash on blockchain
                            const provider = new ethers.providers.Web3Provider(window.ethereum);
                            await provider.send("eth_requestAccounts", []);
                            const signer = provider.getSigner();
                            const contractAddress = "0xba2db7b4d21c13aaf23e050faceb26d4e177f333";
                            const abi = [
                                {
                                    "anonymous": false,
                                    "inputs": [
                                        {
                                            "indexed": true,
                                            "internalType": "address",
                                            "name": "user",
                                            "type": "address"
                                        },
                                        {
                                            "indexed": false,
                                            "internalType": "string",
                                            "name": "ipfsHash",
                                            "type": "string"
                                        }
                                    ],
                                    "name": "VoiceprintStored",
                                    "type": "event"
                                },
                                {
                                    "inputs": [
                                        {
                                            "internalType": "address",
                                            "name": "_user",
                                            "type": "address"
                                        }
                                    ],
                                    "name": "getVoiceprint",
                                    "outputs": [
                                        {
                                            "internalType": "string",
                                            "name": "",
                                            "type": "string"
                                        }
                                    ],
                                    "stateMutability": "view",
                                    "type": "function"
                                },
                                {
                                    "inputs": [
                                        {
                                            "internalType": "string",
                                            "name": "_ipfsHash",
                                            "type": "string"
                                        }
                                    ],
                                    "name": "storeVoiceprint",
                                    "outputs": [],
                                    "stateMutability": "nonpayable",
                                    "type": "function"
                                }
                            ];
                            const contract = new ethers.Contract(contractAddress, abi, signer);
                            const tx = await contract.storeVoiceprint(ipfsHash);
                            await tx.wait();

                            await axios.post('http://127.0.0.1:8000/extract_voiceprint/', { voice_sample: base64String });
                            onRegister();
                        }
                    } catch (error) {
                        console.error('Upload error:', error);
                    } finally {
                        setLoading(false);
                    }
                };
            };

            mediaRecorder.current.start();
            setRecording(true);
        } catch (err) {
            console.error('Error accessing microphone: ', err);
            setLoading(false);
        }
    };

    const stopRecording = () => {
        mediaRecorder.current.stop();
        setLoading(false);
        setRecording(false);
    };

    return (
        <div>
            <button onClick={recording ? stopRecording : startRecording}>
                {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {loading && <Spinner />}
            {audioURL && <audio src={audioURL} controls />}
        </div>
    );
};

export default VoiceRecorder;