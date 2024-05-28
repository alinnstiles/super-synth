import React, { useState, useRef } from 'react';
import NavBar from './NavBar';

const MyRecordings = () => {
  const [playingIndex, setPlayingIndex] = useState(-1);
  const savedSongs = JSON.parse(localStorage.getItem('savedSongs')) || [];
  const synthRef = useRef(null);
  const [activeOscillators, setActiveOscillators] = useState(new Map());

  const playSound = (note, instrument = 'sine') => {
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

  const playNoteByKey = key => {
    const note = getFrequency(key);
    playSound(note);
  };

  const stopNoteByKey = key => {
    const note = getFrequency(key);
    stopSound(note);
  };

  const playSong = (notes, index) => {
    setPlayingIndex(index);
    let startTime = notes[0].startTime;
    notes.forEach(note => {
      setTimeout(() => {
        playNoteByKey(note.key);
        setTimeout(() => {
          stopNoteByKey(note.key);
        }, 500); // Adjust this duration to match your needs
      }, note.startTime - startTime); // Ensure playback with correct timing relative to the start time of the first note
    });
  };

  return (
    <div className="App">
      <NavBar />
      <h1>Saved Songs</h1>
      <div>
        {savedSongs.map((song, index) => (
          <div key={index}>
            <button onClick={() => playSong(song.notes, index)}>
              {playingIndex === index ? 'Playing...' : 'Play'}
            </button>
            <pre>{JSON.stringify(song.notes, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRecordings;