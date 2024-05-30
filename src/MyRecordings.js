import React, {useEffect,useState} from 'react';
import NavBar from './NavBar';
import SongCard from './SongCard';

const MyRecordings = () => {
  
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch('/api/check-session')
    .then(res => res.json())
    .then(promise => {
      fetch('/api/user-recordings')
      .then(res => res.json())
      .then(promise => {
        console.log(promise)
        setSongs(promise)
      })
    })
    .catch(() => {
      alert("Please log in!")
    })
  }, []);

  return (
    <div className="App">
      <NavBar />
      <h2>My Recordings</h2>
      {songs.map(song => <SongCard key={song.id} song={song} />)}
    </div>
  );
};

export default MyRecordings;
