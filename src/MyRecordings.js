import React from 'react';
import NavBar from './NavBar';

const MyRecordings = ({ recordedChunks: propRecordedChunks }) => {
  const [loading, setLoading] = React.useState(true);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  // Simulate fetching data 
  React.useEffect(() => {
    const fetchData = async () => {
      // Fetch data here and update recordedChunks
      // simulate setting the data after 1 second
      setTimeout(() => {
        setRecordedChunks([
          // fetch data here
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="App">
      <NavBar />
      <h2>My Recordings</h2>
      {recordedChunks.map((blob, index) => (
        <div key={index}>
          <audio controls>
            <source src={URL.createObjectURL(blob)} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

export default MyRecordings;
