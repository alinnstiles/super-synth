import React, { useRef, useEffect, useState } from 'react';
import NavBar from './NavBar';
import './NavBar.css';
import axios from 'axios';

const SynthKeys = () => {
  const [selectedInstrument, setSelectedInstrument] = useState('sine');
  const synthRef = useRef(null);
  const [activeOscillators, setActiveOscillators] = useState(new Map());
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // State to hold the duration of the recorded audio

  let mediaRecorder;
  let audioChunks = [];
  let audioPlayer = useRef(null); // Reference to the audio player

  const startRecording = () => {
    audioChunks = [];
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
     .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = e => {
          audioChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          setRecordedChunks(prevChunks => [...prevChunks, audioBlob]);
          audioChunks = [];
        };
        mediaRecorder.start();
      })
     .catch(err => console.error('Error recording:', err));
  };

  const stopRecording = async () => {
    if (mediaRecorder) {
      setIsRecording(false);
      mediaRecorder.stop();
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      try {
        const response = await axios.post('/upload-recording', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data.message);
      } catch (error) {
        console.error('Failed to upload recording:', error);
      }
      audioChunks = [];
    }
  };

  const playRecording = () => {
    if (recordedChunks.length === 0) {
      console.log("No recordings available.");
      return;
    }
    const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
    const audioURL = URL.createObjectURL(audioBlob);
    audioPlayer.current.src = audioURL;
    audioPlayer.current.play();
    setIsPlaying(true);
  };

  const pauseRecording = () => {
    setIsPlaying(false);
    audioPlayer.current.pause();
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioPlayer.current.currentTime);
  };

  const handleDurationChange = () => {
    setDuration(audioPlayer.current.duration);
  };

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

  const keyActions = {
    '1': () => playSound(440, selectedInstrument),
    '2': () => playSound(493.88, selectedInstrument),
    '3': () => playSound(523.25, selectedInstrument),
    '4': () => playSound(587.33, selectedInstrument),
    '5': () => playSound(659.25, selectedInstrument),
    '6': () => playSound(698.46, selectedInstrument),
    '7': () => playSound(783.99, selectedInstrument),
    '8': () => playSound(880, selectedInstrument),
    'r': () => {
      if (!isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = (event) => {
    const action = keyActions[event.key];
    if (action) {
      action();
    }
  };

  return (
    <div className="App">
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
      <button onClick={isPlaying ? pauseRecording : playRecording}>
        {isPlaying ? "Pause Recording" : "Play Recording"}
      </button>
      {isRecording ? <button onClick={stopRecording}>Stop Recording</button> : <button onClick={startRecording}>Start Recording</button>}
      {/* Render the audio player */}
      <audio ref={audioPlayer} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleDurationChange} controls />
    </div>
  );
};

export default SynthKeys;
