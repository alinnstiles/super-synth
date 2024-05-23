import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';

function CommunitySounds() {
  const [publicRecordings, setPublicRecordings] = useState([]);

  useEffect(() => {
    fetch('/public-recordings')
    .then(response => response.json())
    .then(data => setPublicRecordings(data))
    .catch(error => console.error('Failed to load public recordings:', error));
  }, []);
  

  return (
    <div>
      <NavBar />
      <h2>Community Sounds</h2>
      {publicRecordings.map((recording, index) => (
        <div key={index}>
          <audio controls>
            <source src={URL.createObjectURL(recording.blob)} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
}

export default CommunitySounds;
