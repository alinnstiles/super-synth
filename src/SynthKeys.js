import React, { useRef, useEffect, useState } from 'react';
import NavBar from './NavBar'; // Importing NavBar component
//import './SynthKeys.css'; // Importing CSS for SynthKeys
import './NavBar.css'; // Importing CSS for NavBar

const SynthKeys = () => {
  // State and refs initialization
  const [selectedInstrument, setSelectedInstrument] = useState('sine'); // State for selected instrument
  const synthRef = useRef(); // Reference to the audio context
  const midiAccessRef = useRef(null); // Reference to MIDI access
  const [recording, setRecording] = useState(false); // State to manage recording

  // Function to play sound
  const playSound = (note, start = true) => {
    if (start) {
      const synth = new AudioContext(); // Creating a new audio context
      const oscillator = synth.createOscillator(); // Creating an oscillator node
      oscillator.type = selectedInstrument; // Setting oscillator type
      oscillator.frequency.value = note; // Setting frequency
      oscillator.connect(synth.destination); // Connecting oscillator to audio output
      oscillator.start(); // Starting oscillator

      // Stop the sound after a short delay
      setTimeout(() => {
        stopSound();
      }, 50);
    } else {
      const synth = synthRef.current;
      if (synth && synth.state === 'running') {
        synth.close(); // Closing the audio context
      }
    }
  };

  // Function to stop sound
  const stopSound = () => {
    const synth = synthRef.current;
    if (synth && synth.state === 'running') {
      synth.close(); // Closing the audio context
      synthRef.current = null;
    }
  };

  // Handler for instrument change
  const handleInstrumentChange = (event) => {
    setSelectedInstrument(event.target.value); // Setting selected instrument
  };

  // Start recording function
  const startRecording = () => {
    setRecording(true); // Setting recording state to true
  };

  // Stop recording function
  const stopRecording = () => {
    setRecording(false); // Setting recording state to false
  };

  // Effect hook to handle MIDI access
  useEffect(() => {
    navigator.requestMIDIAccess().then((midiAccess) => {
      midiAccessRef.current = midiAccess; // Storing MIDI access reference

      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = (message) => {
          const [command, note, velocity] = message.data;
          if (command === 144 && velocity > 0) {
            playSound(note); // Play sound on MIDI input
          } else if (command === 128 || (command === 144 && velocity === 0)) {
            playSound(note, false); // Stop sound on MIDI input
          }
        };
      });
    });
  }, []);

  // JSX structure
  return (
    <div className="synth-keys">
      <NavBar /> {/* Rendering NavBar component */}
      {/* Dropdown for selecting instrument */}
      <select value={selectedInstrument} onChange={handleInstrumentChange}>
        <option value="sine">Sine Wave</option>
        <option value="square">Square Wave</option>
        <option value="triangle">Triangle Wave</option>
        <option value="sawtooth">Sawtooth Wave</option>
      </select>
      {/* Buttons to play specific notes */}
      <button onClick={() => playSound(440)}>C4</button>
      <button onClick={() => playSound(493.88)}>D4</button>
      <button onClick={() => playSound(523.25)}>E4</button>
      <button onClick={() => playSound(587.33)}>F4</button>
      <button onClick={() => playSound(659.25)}>G4</button>
      <button onClick={() => playSound(698.46)}>A4</button>
      <button onClick={() => playSound(783.99)}>B4</button>
      <button onClick={() => playSound(880)}>C5</button>
      <button onClick={stopSound}>Stop</button> {/* Button to stop all sounds */}
      <button onClick={startRecording}>Start Recording</button> {/* Button to start recording */}
      <button onClick={stopRecording}>Stop Recording</button> {/* Button to stop recording */}
      <input type="range" min="50" max="100" defaultValue="50" onChange={(e) => console.log(e.target.value)} /> {/* Slider for synth length */}
    </div>
  );
};

export default SynthKeys;
