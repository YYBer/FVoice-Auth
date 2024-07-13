import logo from './logo.svg';
import './App.css';
import VoiceRecorder from './component/VoiceRecord';
import { useState, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react'
function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const { open, close } = useWeb3Modal()
  const handleRegister = () => {
      setIsRegistered(true);
  };

  console.log('isRegistered', isRegistered)

  useEffect(() => {
    if(isRegistered) open()
  }, [isRegistered])
  

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
            {/* <w3m-button /> */}
        {/* <VoiceRecorder /> */}
        </div>
        
      </header>
    </div>
  );
}

export default App;
