import React , {useEffect, useState} from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import TextEditor from './TextEditor';
import {getUserNotes, createNote} from './api/userAPI';

type Note = {
  _id : string,
  title: string,
  text: string,
}

function App() {

  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [notes, setNotes] = useState<Note[]>([]);
  const [workingNote, setWorkingNote] = useState<Note>();

  useEffect(()=>{
    if(user){
      console.log(user);
    }
  },[user])
  
  return (
    <div className="App">
      
      <div className='flex flex-row justify-start items-start w-full h-[100vh]'>
      <div id="sidebar" className='w-1/6 h-full bg-stone-100 flex flex-col justify-start items-center'>
      {
      !isAuthenticated ? <LoginButton /> : 
      <div id="logout_functions" className="p-2">
      <div className='text-base font-light pb-4'>Logged in</div>
      <div className='text-base cursor-pointer' onClick={() => 
        logout(
          { 
            logoutParams: {returnTo: window.location.origin}
          }
          )
        }>Click here to logout!</div>
      </div>
      }
      </div>
      <div className='w-full p-2 flex flex-col h-full'>
        <div className='text-3xl pb-2'>
          Note Title
        </div>
        <TextEditor />
        <TextEditor note={workingNote} />
        </div>
      </div>
    </div>
  );
}

export default App;
