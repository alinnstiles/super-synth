import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import { useState, useEffect } from 'react'
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