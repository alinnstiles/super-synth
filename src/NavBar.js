import { Link } from 'react-router-dom'

function NavBar() {

    return (
        <div >
            <h4>
            <Link to="/">Home</Link>
            &nbsp; &nbsp;
            <Link to="/record">Record</Link>
            &nbsp; &nbsp;
            <Link to="/myrecordings">My Recordings</Link>
            &nbsp; &nbsp;
            <Link to="/commsounds">Community Sounds</Link>
            </h4>
        </div>
    )
}

export default NavBar;