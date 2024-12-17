import React from 'react'
import MindMap from './Components/MindMap'
import { useAuth0 } from '@auth0/auth0-react'
function App() {
  const {user,loginWithRedirect,isAuthenticated,logout} = useAuth0();
  console.log(user);
  
  return (
    <div>
      {isAuthenticated ?<button onClick={(e)=> logout()}>Logout</button>:  
      <button onClick={(e)=> loginWithRedirect()}>Login</button>}
      {isAuthenticated && <h3>Hello {user.name}</h3>}
      {isAuthenticated && <img src={user.picture}></img>}
      <MindMap/>
    </div>
  )
}

export default App