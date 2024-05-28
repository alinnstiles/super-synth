import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
    oscillator.start();
    setActiveOscillators(prevState => new Map(prevState).set(note, oscillator));
  };

  const stopSound = note => {
    if (activeOscillators.has(note)) {
      const oscillator = activeOscillators.get(note);
      oscillator.stop();
      setActiveOscillators(prevState => {
        const newMap = new Map(prevState);
        newMap.delete(note);
        return newMap;
      });
    }
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
      if (!activeOscillators.has(note)) {
        playSound(note, selectedInstrument);
        addActiveClass(key);
        if (isRecording) {
          recordNote(key);
        }
      }
    }
  };

  const handleKeyUp = event => {
    const key = event.key.toLowerCase();
    if (WHITE_KEYS.includes(key) || BLACK_KEYS.includes(key)) {
      const note = getFrequency(key);
      stopSound(note);
      removeActiveClass(key);
    }
  };

  const getFrequency = key => {
    switch (key) {
      case 'z': return 261.63; // C4
      case 'x': return 293.66; // D4
      case 'c': return 329.63; // E4
      case 'v': return 349.23; // F4
      case 'b': return 392.00; // G4
      case 'n': return 440.00; // A4
      case 'm': return 493.88; // B4
      case 's': return 277.18; // C#4/Db4
      case 'd': return 311.13; // D#4/Eb4
      case 'g': return 369.99; // F#4/Gb4
      case 'h': return 415.30; // G#4/Ab4
      case 'j': return 466.16; // A#4/Bb4
      default: return 0;
    }
  };

  const addActiveClass = key => {
    const keyElement = document.querySelector(`.key[data-note="${key}"]`);
    if (keyElement) {
      keyElement.classList.add('active');
    }
  };

  const removeActiveClass = key => {
    const keyElement = document.querySelector(`.key[data-note="${key}"]`);
    if (keyElement) {
      keyElement.classList.remove('active');
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
  };

  const playSong = () => {
    if (songNotes.length === 0) return;
  
    let startTime = songNotes[0].startTime;
  
    songNotes.forEach(note => {
      setTimeout(() => {
        playNoteByKey(note.key);
        setTimeout(() => {
          stopNoteByKey(note.key);
        }, 500); // Adjust this duration to match your needs
      }, note.startTime - startTime); // Ensure playback with correct timing relative to the start time of the first note
    });
  };

  const playNoteByKey = key => {
    const note = getFrequency(key);
    playSound(note, selectedInstrument);
    addActiveClass(key);
  };

  const stopNoteByKey = key => {
    const note = getFrequency(key);
    stopSound(note);
    removeActiveClass(key);
  };

  const recordNote = key => {
    setSongNotes(prevNotes => [
      ...prevNotes,
      {
        key: key,
        startTime: Date.now() - recordingStartTime
      }
    ]);
  };

  const saveRecording = () => {
    const recording = JSON.stringify(songNotes, null, 2);
    const savedSongs = JSON.parse(localStorage.getItem('savedSongs')) || [];
    savedSongs.push({ notes: songNotes });
    localStorage.setItem('savedSongs', JSON.stringify(savedSongs));
  };

  const viewSavedSongs = () => {
    navigate('/myrecordings');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeOscillators, selectedInstrument, isRecording]);

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
              const frequency = getFrequency(note);
              playSound(frequency, selectedInstrument);
              addActiveClass(note);
              if (isRecording) {
                recordNote(note);
              }
            }}
            onMouseUp={() => {
              const frequency = getFrequency(note);
              stopSound(frequency);
              removeActiveClass(note);
            }}
            onMouseLeave={() => {
              const frequency = getFrequency(note);
              stopSound(frequency);
              removeActiveClass(note);
            }}
            data-note={note}
          >
            {note}
          </div>
        ))}
      </div>
      <button className={`record-button btn ${isRecording ? 'active' : ''}`} onClick={toggleRecording}>
        {isRecording ? 'Stop Recording' : 'Record'}
      </button>
      <button className="play-button btn" onClick={playSong}>Play</button>
      <button className="save-button btn" onClick={saveRecording}>Save</button>
      <button className="view-saved-songs-button btn" onClick={viewSavedSongs}>View Saved Songs</button>
    </div>
  );
};

export default SynthKeys;