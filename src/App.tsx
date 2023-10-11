import React , {useEffect, useState} from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import TextEditor from './TextEditor';
import {getUserNotes, createNote, deleteNote} from './api/userAPI';
import { Note } from './types/Note'
import { updateNote } from './api/userAPI';
import {AiOutlineCheck, AiFillDelete, AiOutlineFileText, AiOutlinePlus} from 'react-icons/ai';
import {BsDot} from 'react-icons/bs';
import Sidebar from './Sidebar';

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
    }, 3000);
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
    if(newNoteCooldown) return;

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
        (
        <div className={`flex flex-row justify-start items-center pl-5 w-full cursor-pointer
        font-verylight text-stone-900
        " + ${workingNote?._id === note._id ? 'bg-stone-200' : 'bg-transparent'}`} 
        onClick={()=>openNote(note?._id)}
        key={note?._id}
        >
          <div>
            <BsDot className='w-5 h-5 text-stone-900'/>
          </div>
          <div>
            {note?.title}
          </div>
        </div>)
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

        <Sidebar initializeNewNote={initializeNewNote} renderNoteList={renderNoteList} newNoteCooldown={newNoteCooldown}/>

        <div className='w-full p-2 flex flex-col h-full '>
          <div className='flex w-full justify-between items-center gap-3 pe-5 bg-stone-50'>
          <input className='text-3xl py-1 outline-none w-3/4 max-w-[600px] text-stone-800 bg-stone-50' maxLength={32} value={workingNote?.title} onChange={handleTitleInput}/>
          {
          confirmTitle ?
          <button className='flex hover:bg-stone-200 px-2 py-1 rounded-lg content-center items-center' onClick={performTitleChange}>
            <AiOutlineCheck /> confirm
          </button>
          : 
          <></>
          }
      
          <button className={`text-lg hover:text-white px-2 py-2 rounded-md ${disableDelete ? 'hover:bg-stone-300' : 'hover:bg-red-500'}`} onClick={handleDeleteNote} disabled={disableDelete}>
            <AiFillDelete />
          </button>
          </div>
            <TextEditor noteId={workingNote?._id} getNoteById={getNoteById} updateNoteContent={updateNoteContent}/>
          </div>

      </div>
    </div>
  );
}

export default App;
