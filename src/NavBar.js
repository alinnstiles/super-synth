import { Link } from 'react-router-dom'
import './NavBar.css';

function NavBar() {

    return (
        <div class="scrollmenu">
                <a href="/" class="active">Home</a>
                <a href="/record">Record</a>
                <a href="/myrecordings">My Recordings</a>
                <a href="commsounds">Community Sounds</a>
            {/* <Link to="/">Home</Link>
            &nbsp; &nbsp;
            <Link to="/record">Record</Link>
            &nbsp; &nbsp;
            <Link to="/myrecordings">My Recordings</Link>
            &nbsp; &nbsp;
            <Link to="/commsounds">Community Sounds</Link> */}
        </div>
    )
}

export default NavBar;