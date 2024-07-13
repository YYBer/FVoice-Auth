// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import Spinner from './Spinner';

// const VoiceRecorder = ({ isRegistered, onRegister }) => {
//     const [recording, setRecording] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [audioURL, setAudioURL] = useState('');
//     const mediaRecorder = useRef(null);
//     const audioChunks = useRef([]);

//     const startRecording = async () => {
//         setLoading(true);
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder.current = new MediaRecorder(stream);

//             mediaRecorder.current.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     audioChunks.current.push(event.data);
//                 }
//             };

//             mediaRecorder.current.onstop = async () => {
//                 const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setAudioURL(audioUrl);
//                 audioChunks.current = [];

//                 // Upload audioBlob to Django backend
//                 const formData = new FormData();
//                 formData.append('username', 'testuser'); // Replace with actual username
//                 formData.append('voice_sample', audioBlob, 'recording.wav');

//                 try {
//                     console.log('click')
//                     // setLoading(true);
//                     // const url = isRegistered ? 'http://127.0.0.1:8000/api/login/' : 'http://127.0.0.1:8000/api/register/';
//                     // const response = await axios.post(url, formData, {
//                     //     headers: {
//                     //         'Content-Type': 'multipart/form-data'
//                     //     }
//                     // });
//                     // console.log('Response:', response.data);
//                     // if (!isRegistered) {
//                     //     onRegister();
//                     // }
//                     onRegister();
//                 } catch (error) {
//                     console.error('Upload error:', error);
//                 } finally {
//                     // setLoading(false);
//                 }
//             };

//             mediaRecorder.current.start();
//             setRecording(true);
//         } catch (err) {
//             console.error('Error accessing microphone: ', err);
//         }
//     };

//     const stopRecording = () => {
//         mediaRecorder.current.stop();
//         setLoading(false);
//         setRecording(false);
//     };

//     return (
//         <div>
//             <button onClick={recording ? stopRecording : startRecording}>
//                 {recording ? 'Stop Recording' : 'Start Recording'}
//             </button>
//             {loading && <Spinner />}
//             {audioURL && <audio src={audioURL} controls />}
//         </div>
//     );
// };

// export default VoiceRecorder;


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

                // Upload audioBlob to Django backend
                const formData = new FormData();
                formData.append('voice_sample', audioBlob, 'recording.wav');

                try {
                    setLoading(true);
                    let response;
                    if (isRegistered) {
                        response = await axios.post('http://127.0.0.1:8000/authapp/compare/', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    } else {
                        await axios.post('http://127.0.0.1:8000/authapp/record/', {
                            record_seconds: 5
                        });
                        await axios.post('http://127.0.0.1:8000/authapp/extract/', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                        onRegister();
                        setLoading(false);
                        return;
                    }
                    console.log('Response:', response.data);
                } catch (error) {
                    console.error('Upload error:', error);
                } finally {
                    setLoading(false);
                }
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