import React, { useRef, useEffect, useState } from 'react';
import NavBar from './NavBar';
import './NavBar.css';
import './SynthKeys.css';

const SynthKeys = () => {
  const [selectedInstrument, setSelectedInstrument] = useState('sine');
  const synthRef = useRef(null);
  const [activeOscillators, setActiveOscillators] = useState(new Map());
  const [recordingStartTime, setRecordingStartTime] = useState(0);
  const [songNotes, setSongNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const keysData = [
    { note: 'z', class: 'white' },  // C4
    { note: 's', class: 'black' },  // C#4/Db4
    { note: 'x', class: 'white' },  // D4
    { note: 'd', class: 'black' },  // D#4/Eb4
    { note: 'c', class: 'white' },  // E4
    { note: 'v', class: 'white' },  // F4
    { note: 'g', class: 'black' },  // F#4/Gb4
    { note: 'b', class: 'white' },  // G4
    { note: 'h', class: 'black' },  // G#4/Ab4
    { note: 'n', class: 'white' },  // A4
    { note: 'j', class: 'black' },  // A#4/Bb4
    { note: 'm', class: 'white' }   // B4
  ];

  const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
  const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j'];

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

  const handleInstrumentChange = event => {
    setSelectedInstrument(event.target.value);
  };

  const handleKeyDown = event => {
    const key = event.key.toLowerCase();
    if (WHITE_KEYS.includes(key) || BLACK_KEYS.includes(key)) {
      const note = getFrequency(key);
      playSound(note, selectedInstrument);
      addActiveClass(note);
      if (isRecording) {
        recordNote(key);
      }
    }
  };

  const handleKeyUp = event => {
    const key = event.key.toLowerCase();
    if (WHITE_KEYS.includes(key) || BLACK_KEYS.includes(key)) {
      const note = getFrequency(key);
      removeActiveClass(note);
    }
  };

  const getFrequency = key => {
    // Map keys to frequencies here
    switch (key) {
      // White keys
      case 'z':
        return 261.63; // C4
      case 'x':
        return 293.66; // D4
      case 'c':
        return 329.63; // E4
      case 'v':
        return 349.23; // F4
      case 'b':
        return 392.00; // G4
      case 'n':
        return 440.00; // A4
      case 'm':
        return 493.88; // B4
      // Black keys
      case 's':
        return 277.18; // C#4/Db4
      case 'd':
        return 311.13; // D#4/Eb4
      case 'g':
        return 369.99; // F#4/Gb4
      case 'h':
        return 415.30; // G#4/Ab4
      case 'j':
        return 466.16; // A#4/Bb4
      default:
        return 0;
    }
  };

  const addActiveClass = note => {
    const key = document.querySelector(`.key[data-note="${note}"]`);
    if (key) {
      key.classList.add('active');
      // Set a timeout to remove the 'active' class after 50ms
      setTimeout(() => {
        key.classList.remove('active');
      }, 50);
    }
  };
  
  const removeActiveClass = note => {
    const key = document.querySelector(`.key[data-note="${note}"]`);
    if (key) {
      key.classList.remove('active');
    }
  };

  const toggleRecording = () => {
    setIsRecording(prevState => !prevState);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    setRecordingStartTime(Date.now());
    setSongNotes([]);
  };

  const stopRecording = () => {
    setIsRecording(false);
    playSong();
  };

  const playSong = () => {
    if (songNotes.length === 0) return;
    songNotes.forEach(note => {
      setTimeout(() => {
        playNoteByKey(note);
      }, note.startTime);
    });
  };

  const playNoteByKey = key => {
    const noteAudio = document.getElementById(key);
    if (noteAudio) {
      noteAudio.currentTime = 0;
      noteAudio.play();
      const keyElement = document.querySelector(`.key[data-note="${key}"]`);
      if (keyElement) {
        keyElement.classList.add('active');
        noteAudio.addEventListener('ended', () => {
          keyElement.classList.remove('active');
        });
      }
    }
  };

  const recordNote = note => {
    setSongNotes(prevNotes => [
      ...prevNotes,
      {
        key: note,
        startTime: Date.now() - recordingStartTime
      }
    ]);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="App">
      <NavBar />
      <select value={selectedInstrument} onChange={handleInstrumentChange} className="btn">
        <option value="sine">Sine Wave</option>
        <option value="square">Square Wave</option>
        <option value="triangle">Triangle Wave</option>
        <option value="sawtooth">Sawtooth Wave</option>
      </select>
      <button onClick={stopAllSounds} className="btn">Stop</button>
      <div className="piano">
        {keysData.map(({ note, class: keyClass }, index) => (
          <div
            key={index}
            className={`key ${keyClass}`}
            onMouseDown={() => {
              playSound(getFrequency(note), selectedInstrument);
              addActiveClass(note);
              if (isRecording) {
                recordNote(note);
              }
            }}
            onMouseUp={() => removeActiveClass(note)}
            onMouseLeave={() => removeActiveClass(note)}
            data-note={note}
          >
            {note}
          </div>
        ))}
      </div>
      <button className={`record-button btn ${isRecording ? 'active' : ''}`} onClick={toggleRecording}>
        {isRecording ? 'Stop Recording' : 'Record'}
      </button>
      <button className="play-button btn active">Play</button>
      <button className="save-button btn active">Save</button>
    </div>
  );
};

export default SynthKeys;
