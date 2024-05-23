import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import { useState, useEffect } from 'react'
// import Login from './UserPanel/Login'
// import Signup from './UserPanel/Signup'
// import UserDetails from './UserPanel/UserDetails'
// import Index from './UserPanel/Index'
import UserPanel from './UserPanel'

function Home() {

  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    fetch('/api/check-session')
    .then(response => {
      if (response.status === 200) {
        response.json()
        .then(loggedInUser => setCurrentUser(loggedInUser))
      }
    })
  }, [])


  return (
    <div className="App">
      <NavBar />
      <h2>Welcome To Super Synth!</h2>

      <UserPanel currentUser={currentUser} setCurrentUser={setCurrentUser} />
      
    </div>
  );
}
  
export default Home