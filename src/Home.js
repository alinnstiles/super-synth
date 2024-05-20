import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

function Home() {
  return (
    <div>
      <NavBar />
    <h2>Welcome To Super Synth!</h2>
    </div>
  );
}
  
export default Home