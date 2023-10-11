import React , {useEffect, useState} from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import TextEditor from './TextEditor';
import {getUserNotes, createNote, deleteNote} from './api/userAPI';
import { Note } from './types/Note'
import { updateNote } from './api/userAPI';
import {AiOutlineCheck} from 'react-icons/ai';

function App() {

  const { user, isAuthenticated, logout } = useAuth0();
  const [notes, setNotes] = useState<Note[]>([]);
  const [workingNote, setWorkingNote] = useState<Note>();
  const [confirmTitle, setConfirmTitle] = useState<boolean>(false);
  const [lastTitleChange, setLastTitleChange] = useState<Date>();
  const [disableDelete, setDisableDelete] = useState<boolean>(false);
  const [newNoteCooldown, setNewNoteCooldown] = useState<boolean>(false);

  useEffect(()=>{
    if(user){
      console.log("successfully logged in as : " + user.email);
      refreshNoteList(true);
    }
  },[user]);

  useEffect(()=>{
    //if there are no notes, we want to make a new one so the editor don't bug out!
    if(notes.length === 0){
      setTimeout(()=>
      {
        initializeNewNote();
      }, 1900);
    }
    //if there is some notes, but none of them are the current 'workingNote', then we need to reselect another
    //existing note as the workingNote so our editor can rerender!
    else if(!notes.some(note => note._id === workingNote?._id)){
      setWorkingNote(notes[0]);
    }
  }, [notes])

  //If the changes were not confirmed within 5 seconds, save them anyway.
  useEffect(()=>{
    const changeTitleInterval = setTimeout(()=>{
      if(lastTitleChange){
        performTitleChange();
        }
    }, 5000);
    return () => clearInterval(changeTitleInterval);
  },[lastTitleChange])

  //2.5 second delete note button cooldown!@#$@!#$!@
  useEffect(()=>{
    if(disableDelete){
      const toggleDelete = setTimeout(()=>{
        setDisableDelete(false)
      }, 2000);
      return () => clearInterval(toggleDelete);
    }
  }, [disableDelete])

  useEffect(()=>{
    if(newNoteCooldown){
      const toggleMakeNewNote = setTimeout(()=>{
        setNewNoteCooldown(false)
      }, 3000);
      return () => clearInterval(toggleMakeNewNote);
    }
  }, [newNoteCooldown])


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

  function updateNoteContent(id: string, newContent : string){
    const updatedNotes = [...notes];
    const noteToUpdate = updatedNotes.find((note : Note) => note._id === id);
    if(noteToUpdate){
      noteToUpdate.text = newContent;
      //update the note in React state
      setNotes(updatedNotes);
      //call a database update
      updateNote(noteToUpdate as Note);
    }
    
  }

  //updates the note in the 'notes' state as well as the database!
  function updateNoteTitle(id: string, newTitle : string){
    const updatedNotes = [...notes];
    const noteToUpdate = updatedNotes.find((note : Note) => note._id === id);
    if(noteToUpdate){
      noteToUpdate.title = newTitle;
      //update the note in React state
      setNotes(updatedNotes);
      //call a database update
      updateNote(noteToUpdate as Note);
    }
    
  }

  //for creating a new note in the database
  //will also refresh the note list
  function initializeNewNote(){

    if(user?.email){
      console.log("New note!");
      createNote(user.email, "").then((response: any) => 
      { 
        //add it to the notes state, and THEN set it as the working note!
        setNotes(notes => [...notes, response?.data.newNote as Note]);
        setWorkingNote(response?.data.newNote as Note);
        //performTitleChange();
        refreshNoteList(false);
        setNewNoteCooldown(true);
      });

    }
  }

  //set the new working note to be the one with the matching id parameter
  function openNote(id: string | undefined){
    setWorkingNote(notes.find((note : Note) => note._id === id));
  }

  //get a note object from state by ID -> used in TextEditor to fetch a newly selected note's content
  function getNoteById(id : string){
    return notes.find((note : Note) => note._id === id);
  }

  //for rendering the existing notes in the sidebar!
  function renderNoteList(){
    return (
      notes?.map(note => 
        //{`text-white ${true?'text-green-500' : 'text-red-500'`}
        (<div className={`cursor-pointer bg-stone-200 p-1 rounded-md" + ${workingNote?._id === note._id ? 'bg-stone-300' : 'bg-stone-200'}`} onClick={()=>openNote(note?._id)} key={note?._id}>{note?.title}</div>)
        )
    )
  }

  //changes the value so the input box value changes, but NOTHING else updates (no DB or sidebar update!!!)
  function handleTitleInput(event : any){
    event.preventDefault();
    //console.log(event?.target.value);
    setLastTitleChange(new Date());
    setConfirmTitle(true);
    setWorkingNote({...workingNote, title: event?.target.value} as Note);
  }

  //confirms the title change by changing the value in the notes state and the DB
  function performTitleChange(){
    if(workingNote){
      updateNoteTitle(workingNote?._id, workingNote?.title);
      setConfirmTitle(false);
    }
  }

  function handleDeleteNote(){
    deleteNote(workingNote as Note, user?.email).then(res=>console.log(res.data?.success));
    setNotes(notes => notes.filter(note => note._id !== workingNote?._id));
    setDisableDelete(true);
    //setWorkingNote(notes[0] || undefined);
  }
  
  return (
    <div className="App">
      
      <div className='flex flex-row justify-start items-start w-full h-[100vh]'>
      <div id="sidebar" className='w-1/6 h-full bg-stone-100 flex flex-col justify-start items-center'>
      {
      !isAuthenticated ? <LoginButton /> : 
      <div id="logout_functions" className="p-2">
      <div className='text-base pb-4 font-semibold'>Logged in</div>
      <div className='text-base cursor-pointer text-center bg-stone-200 hover:bg-stone-300' onClick={() => 
        logout(
          { 
            logoutParams: {returnTo: window.location.origin}
          }
          )
        }>Logout?</div>
      </div>
      }
      <button disabled={newNoteCooldown} onClick={initializeNewNote} className='hover:bg-stone-300 bg-stone-200 text-sm rounded-lg p-2'>
        Make a New Note
      </button>
      <div className='flex flex-col justify-center items-center gap-2 my-3'>
      {
        renderNoteList()
      }
      </div>
      </div>
      <div className='w-full p-2 flex flex-col h-full'>
        <div className='flex w-full justify-start items-center gap-3'>
        <input className='text-3xl pb-2 outline-none w-3/4 max-w-[600px]' maxLength={32} value={workingNote?.title} onChange={handleTitleInput}/>
        {
        confirmTitle ?
        <button className='flex hover:bg-stone-200 px-2 py-1 rounded-lg content-center items-center' onClick={performTitleChange}>
          <AiOutlineCheck /> confirm
        </button>
        
        : <></>
        }
        {/* className={`cursor-pointer bg-stone-200 p-1 rounded-md" + ${workingNote?._id === note._id ? 'bg-stone-300' : 'bg-stone-200'}`} */}
        {/* div className={`text-white ${isActive ? 'bg-blue-500' : 'bg-red-500'}`} */}
    
        <button className={` hover:text-white px-2 py-1 rounded-md ${disableDelete ? 'hover:bg-stone-300' : 'hover:bg-red-500'}`} onClick={handleDeleteNote} disabled={disableDelete}>
          Delete
        </button>
        </div>
        <TextEditor noteId={workingNote?._id} getNoteById={getNoteById} updateNoteContent={updateNoteContent}/>
        </div>
      </div>
    </div>
  );
}

export default App;
