import React, { useState, useRef } from 'react';
import axios from 'axios';
import Spinner from './Spinner';

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
                            response = await axios.post('http://127.0.0.1:8000/compare_voiceprint/', { voice_sample: base64String });
                            console.log('Response:', response.data);
                        } else {
                            await axios.post('http://127.0.0.1:8000/record_voice/', { record_seconds: 5 });
                            response = await axios.post('http://127.0.0.1:8000/extract_voiceprint/', { voice_sample: base64String });
                            console.log('Voiceprint:', response.data.voiceprint);
                            onRegister();
                        }
                    } catch (error) {
                        onRegister(); // need to fix it
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
            {
                audioURL.length <= 0 && (
<button onClick={recording ? stopRecording : startRecording}>
                {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
                )
            }
            
            {loading && <Spinner />}
            {audioURL &&  audioURL.length <= 0 && <audio src={audioURL} controls />}
            { audioURL.length > 0 && (
                <w3m-button />
            )}
        </div>
    );
};

export default VoiceRecorder;