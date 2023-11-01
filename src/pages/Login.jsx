import { useAuth0 } from '@auth0/auth0-react'
import React, { useEffect } from 'react'
import {motion} from 'framer-motion'

const Login = () => {

    const {isAuthenticated, loginWithRedirect} = useAuth0();

    useEffect(()=>{
        if(!isAuthenticated){
            loginWithRedirect();
            return;
        }
    }, [isAuthenticated, loginWithRedirect])

  return (
    <motion.div className='w-full h-full'
    initial={{opacity:1, backgroundColor:'rgb(68, 64, 60)'}}
    animate={{opacity:1, backgroundColor:'rgb(245, 245, 244)', transition:{
      repeat: Infinity,
      repeatType:"mirror"
    }}}></motion.div>
  )
}

export default Login