import logo from './logo.svg';
import './App.css';
import VoiceRecorder from './component/VoiceRecord';
import { useState } from 'react';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
      setIsRegistered(true);
  };

  console.log('isRegistered', isRegistered)

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>
          FVoice AUTH
        </h1>
        <div className='flex w-1/2 justify-center items-center gap-4'>
          {/* <p>
          Register your voice
          </p> */}
          
          <h1>{isRegistered ? 'Login' : 'Register'}</h1>
            <VoiceRecorder isRegistered={isRegistered} onRegister={handleRegister} />
        {/* <VoiceRecorder /> */}
        </div>
        
      </header>
    </div>
  );
}

export default App;
