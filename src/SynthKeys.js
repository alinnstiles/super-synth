import React, { useRef, useEffect, useState } from 'react';
import NavBar from './NavBar';
import './NavBar.css';

const SynthKeys = () => {
  const [selectedInstrument, setSelectedInstrument] = useState('sine');
  const synthRef = useRef(null);
  const [activeOscillators, setActiveOscillators] = useState(new Map());

  const playSound = (note, instrument) => {
    const synth = synthRef.current || (synthRef.current = new AudioContext());
    const oscillator = synth.createOscillator();
    oscillator.type = instrument;
    oscillator.frequency.value = note;
    oscillator.connect(synth.destination);

    setActiveOscillators(prevState => new Map(prevState).set(note, oscillator));

    oscillator.start();
  };

  const stopAllSounds = () => {
    activeOscillators.forEach(oscillator => {
      oscillator.stop();
    });
    setActiveOscillators(new Map());
  };

  const handleInstrumentChange = (event) => {
    setSelectedInstrument(event.target.value);
  };

  const handleKeyDown = (event) => {
    const action = keyActions[event.key];
    if (action) {
      action();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array to run only once

  const keyActions = {
    '1': () => playSound(440, selectedInstrument),
    '2': () => playSound(493.88, selectedInstrument),
    '3': () => playSound(523.25, selectedInstrument),
    '4': () => playSound(587.33, selectedInstrument),
    '5': () => playSound(659.25, selectedInstrument),
    '6': () => playSound(698.46, selectedInstrument),
    '7': () => playSound(783.99, selectedInstrument),
    '8': () => playSound(880, selectedInstrument),
  };

  return (
    <div className="synth-keys">
      <NavBar />
      <select value={selectedInstrument} onChange={handleInstrumentChange}>
        <option value="sine">Sine Wave</option>
        <option value="square">Square Wave</option>
        <option value="triangle">Triangle Wave</option>
        <option value="sawtooth">Sawtooth Wave</option>
      </select>
      {Object.entries(keyActions).map(([key, action]) => (
        <button key={key} onClick={action}>{key}</button>
      ))}
      <button onClick={stopAllSounds}>Stop</button>
      <input type="range" min="50" max="100" defaultValue="50" onChange={(e) => console.log(e.target.value)} />
    </div>
  );
};

export default SynthKeys;

