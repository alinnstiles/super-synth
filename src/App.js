import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
      <Router>
        <Switch>
          <Route exact path="/" component={SynthKeys} />
          <Route path="/myrecordings" component={MyRecordings} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
