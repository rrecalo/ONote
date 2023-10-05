import React , {useEffect} from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';

function App() {

  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  return (
    <div className="App">
      {
      !isAuthenticated ? <LoginButton /> : 
      <div>
      <div className='text-2xl font-light'>Looks like you're logged in!</div>
      <div onClick={() => 
        logout(
          { 
            logoutParams: {returnTo: window.location.origin}
          }
          )
        }>Click here to logout!</div>
      </div>
      }
    </div>
  );
}

export default App;
