import React, { useState } from 'react';
import './App.css';
import SynthKeys from './SynthKeys';
import NavBar from './NavBar';
import MyRecordings from './MyRecordings';

const App = () => {
  const [recordedChunks, setRecordedChunks] = useState([]);

  return (
    <div className="App">
      <h1>Synth Keys</h1>
      <NavBar />
      <SynthKeys setRecordedChunks={setRecordedChunks} />
      <MyRecordings recordedChunks={recordedChunks} />
    </div>
  );
};

export default App;
