import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import './NavBar.css';
import './CommunitySounds.css';
import userEvent from '@testing-library/user-event';
import SongCard from './SongCard'


function CommunitySounds() {
  
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch('/api/all-recordings')
    .then(res => res.json())
    .then(promise => {
      setSongs(promise);
      // console.log(promise);
    })
  }, [])
  
  return (
    <div className="comment-section">
      <NavBar /> 
      <h1>Community Heat 🔥</h1>
      {songs.map(song => <SongCard key={song.id} song={song} />)}
    </div>
  );
}

export default CommunitySounds;
