import React, { useRef, useEffect, useState } from 'react';
import NavBar from './NavBar';
import './NavBar.css';

const SynthKeys = () => {
  const [selectedInstrument, setSelectedInstrument] = useState('sine');
  const synthRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // New state to track playing status

  const playSound = (note, start = true) => {
    const synth = synthRef.current || (synthRef.current = new AudioContext());
    const oscillator = synth.createOscillator();
    oscillator.type = selectedInstrument;
    oscillator.frequency.value = note;
    oscillator.connect(synth.destination);
  
    oscillator.onended = () => {
      setIsPlaying(false); // Reset playing state when stopping
    };
  
    if (start) {
      oscillator.start();
      setIsPlaying(true); // Set playing to true when starting
    } else {
      if (isPlaying) { // Only attempt to stop if the oscillator was started
        oscillator.stop();
        setIsPlaying(false); // Reset playing state when stopping
      }
    }
  };
  
  const handleInstrumentChange = (event) => {
    setSelectedInstrument(event.target.value);
  };

  const keyActions = {
    '1': () => playSound(440),
    '2': () => playSound(493.88),
    '3': () => playSound(523.25),
    '4': () => playSound(587.33),
    '5': () => playSound(659.25),
    '6': () => playSound(698.46),
    '7': () => playSound(783.99),
    '8': () => playSound(880),
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isNaN(event.key)) {
        const action = keyActions[event.key];
        if (action) {
          setSelectedInstrument(event.target.value); // Update selectedInstrument state
          action();
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedInstrument]); // Include selectedInstrument in the dependency array
  

  return (
    <div className="synth-keys">
      {/* Render NavBar component */}
      <NavBar />
      
      {/* Dropdown to select instrument */}
      <select value={selectedInstrument} onChange={handleInstrumentChange}>
        <option value="sine">Sine Wave</option>
        <option value="square">Square Wave</option>
        <option value="triangle">Triangle Wave</option>
        <option value="sawtooth">Sawtooth Wave</option>
      </select>
      
      {/* Buttons for playing notes */}
      {Object.entries(keyActions).map(([key, action]) => (
        <button key={key} onClick={action}>{key}</button>
      ))}
      
      {/* Button to stop playing */}
      <button onClick={() => playSound(440, false)}>Stop</button>
      
      {/* Input range for volume control */}
      <input type="range" min="50" max="100" defaultValue="50" onChange={(e) => console.log(e.target.value)} />
    </div>
  );
};

export default SynthKeys;
