import React from 'react';
import './App.css';
import SynthKeys from './SynthKeys';
// import MyRecordings from './MyRecordings';
// import CommunitySounds from './CommunitySounds';
import NavBar from './NavBar';
import Home from './Home';

function App() {
  return (
    <div className="App">
      <h1>Synth Keys</h1>
      <SynthKeys />
      <NavBar />
    </div>
  );
}

export default App;
