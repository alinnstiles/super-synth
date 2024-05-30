import react, { useRef,useState } from 'react';
import './NavBar.css';
import Comment from './Comment';

function SongCard({song}){

    const [songLikes, setSongLikes] = useState(false)
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(song.comments)

    const synthRef = useRef(null);

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

    async function processSound(sound) {
        return new Promise((resolve) => {
            const synth = synthRef.current || (synthRef.current = new AudioContext());
            const oscillator = synth.createOscillator();
            oscillator.type = song["selected_instrument"];
            oscillator.frequency.value = getFrequency(sound.key);
            oscillator.connect(synth.destination);
            oscillator.start();
            console.log("Processed sound");
            setTimeout(() => {
                // const oscillator = sound.key;
                oscillator.stop();
                resolve();
            }, 300);
        });
    };
    
    async function playSong() {
        for (const sound of song.notes){
            await processSound(sound);
        }
        console.log("All notes played")
    };

    const handleInputChange = (event) => {
        setNewComment(event.target.value);
        console.log(newComment)
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/api/comment', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment: newComment,
                recording_id: song.id
            })
        })
        .then(res => res.json())
        .then(promise => {
            setComments([...comments, promise])
            setNewComment('')
        })
    };

    const handleSongLike = () => {
        fetch(`/api/patch-recording/${song.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Flames": song.likes + (songLikes ? (1) : (-1))
            })
        })
        .then(res => res.json())
        .then(promise => {
            console.log(promise.likes)
            setSongLikes(!songLikes)
        })
    }

    return (
        <div className="song-item">
            <h3>{song.name}</h3>
            <p><b>{"By: " + song.user.username}</b></p>
            <p>{"Flames: " + song.likes}</p>
            <button className="play-button btn" onClick={playSong}>Play</button>
            <button onClick={handleSongLike}>{songLikes ? "Unflame" : "🔥"}</button>
            <h2>Comments</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                value={newComment}
                onChange={handleInputChange}
                placeholder="Add your comment..."
                />
                <button type="submit">Post</button>
            </form>
            <div className="comments-list">
                {comments.map(current => (
                <Comment current={current} key={current.id}/>
                ))}
            </div>
        </div>
    )
}

export default SongCard