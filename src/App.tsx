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
      console.log("successfully logged in as : " + user.email);
      refreshNoteList(true);
    }
  },[user])

  //for 'refreshing' the list of notes associated with the user
  //*is called on first render, and every time a new note is created
  //the setNotes() call triggers a re-render of the notes list in the sidebar
  //if loadFirstNote is 'true', then the current working note is set to the first one
  //that is returned from the database
  function refreshNoteList(loadFirstNote: boolean){
    getUserNotes(user?.email).then((response: any)=>{
      if(loadFirstNote){
        setWorkingNote(response.data[0]);
      }
      setNotes(response.data);
    });
  }

  //for creating a new note in the database
  //will also refresh the note list
  function initializeNewNote(){
    if(user?.email){
      console.log("New note!");
      createNote(user.email, "Sample text...").then((response: any) => 
      { 
        console.log(response?.data.newNote as Note);
        setWorkingNote(response?.data.newNote as Note);
        refreshNoteList(false);
      });

    }
  }

  function openNote(id: string | undefined){
    setWorkingNote(notes.find((note : Note) => note._id === id));
  }

  function renderNoteList(){
    return (
      notes?.map(note => 
        //{`text-white ${true?'text-green-500' : 'text-red-500'`}
        (<div className={`cursor-pointer bg-stone-200 p-1 rounded-md" + ${workingNote?._id === note._id ? 'bg-stone-300' : 'bg-stone-200'}`} onClick={()=>openNote(note?._id)} key={note?._id}>{note?.title}</div>)
        )
    )
  }
  
  return (
    <div className="App">
      
      <div className='flex flex-row justify-start items-start w-full h-[100vh]'>
      <div id="sidebar" className='w-1/6 h-full bg-stone-100 flex flex-col justify-start items-center'>
      {
      !isAuthenticated ? <LoginButton /> : 
      <div id="logout_functions" className="p-2">
      <div className='text-base font-light pb-4 font-semibold'>Logged in</div>
      <div className='text-base cursor-pointer text-center bg-stone-200 hover:bg-stone-300' onClick={() => 
        logout(
          { 
            logoutParams: {returnTo: window.location.origin}
          }
          )
        }>Logout?</div>
      </div>
      }
      <button onClick={initializeNewNote} className='hover:bg-stone-300 bg-stone-200 text-sm rounded-lg p-2'>
        Make a New Note
      </button>
      <div className='flex flex-col justify-center items-center gap-2 my-3'>
      {
        renderNoteList()
      }
      </div>
      </div>
      <div className='w-full p-2 flex flex-col h-full'>
        <div className='text-3xl pb-2'>
          {workingNote?.title || "Note Title"}
        </div>
        <TextEditor note={workingNote} />
        </div>
      </div>
    </div>
  );
}

export default App;
