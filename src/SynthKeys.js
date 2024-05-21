import React, { useRef, useEffect, useState } from 'react';
import NavBar from './NavBar'
import './SynthKeys.css';
import './NavBar.css';

const SynthKeys = () => {
  const [selectedInstrument, setSelectedInstrument] = useState('sine'); // State to hold the selected instrument
  const synthRef = useRef();
  const midiAccessRef = useRef(null);

  const playSound = (note, start = true) => {
    if (start) {
      const synth = new AudioContext();
      const oscillator = synth.createOscillator();
      oscillator.type = selectedInstrument; // Use the selected instrument type
      oscillator.frequency.value = note;
      oscillator.connect(synth.destination);
      oscillator.start();
      synthRef.current = synth;
      
      setTimeout(() => {
        stopSound();
      }, 50);
    } else {
      const synth = synthRef.current;
      if (synth && synth.state === 'running') {
        synth.close();
      }
    }
  };

  /** 
  useEffect(() => {
    navigator.requestMIDIAccess().then((midiAccess) => {
      midiAccessRef.current = midiAccess;

      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = (message) => {
          const [command, note, velocity] = message.data;
          if (command === 144 && velocity > 0) {
            playSound(note);
          } else if (command === 128 || (command === 144 && velocity === 0)) {
            playSound(note, false);
          }
        };
      });
    });
  }, []);

  */

  const stopSound = () => {
    const synth = synthRef.current;
    if (synth && synth.state === 'running') {
      synth.close();
      synthRef.current = null;
    }
  };

  // Function to handle instrument change
  const handleInstrumentChange = (event) => {
    setSelectedInstrument(event.target.value);
  };

  return (
    <div className="synth-keys">
    
    <div>
    <NavBar />
      {/* Dropdown for selecting instrument */}
      <select value={selectedInstrument} onChange={handleInstrumentChange}>
        <option value="sine">Sine Wave</option>
        <option value="square">Square Wave</option>
        <option value="triangle">Triangle Wave</option>
        <option value="sawtooth">Sawtooth Wave</option>
      </select>
      {/* Buttons for notes */}
      <button onClick={() => playSound(440)}>C4</button>
      <button onClick={() => playSound(493.88)}>D4</button>
      <button onClick={() => playSound(523.25)}>E4</button>
      <button onClick={() => playSound(587.33)}>F4</button>
      <button onClick={() => playSound(659.25)}>G4</button>
      <button onClick={() => playSound(698.46)}>A4</button>
      <button onClick={() => playSound(783.99)}>B4</button>
      <button onClick={() => playSound(880)}>C5</button>
      <button onClick={stopSound}>Stop</button>
    </div>
    </div>  
  );
};

export default SynthKeys;
