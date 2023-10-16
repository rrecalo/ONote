import { useAuth0 } from '@auth0/auth0-react'
import React, { useEffect } from 'react'

const Login = () => {

    const {isAuthenticated, loginWithRedirect} = useAuth0();

    useEffect(()=>{
        if(!isAuthenticated){
            loginWithRedirect();
            return;
        }
    }, [isAuthenticated, loginWithRedirect])

  return (
    <div>Login</div>
  )
}

export default Login