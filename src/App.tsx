import React , {useEffect, useState} from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import TextEditor from './TextEditor';
import {getUserNotes, createNote, deleteNote, getUserFolders, updateFolder, createFolder, deleteFolder} from './api/userAPI';
import { Note } from './types/Note'
import { updateNote } from './api/userAPI';
import {AiOutlineCheck, AiOutlineFileText} from 'react-icons/ai';
import Sidebar from './Sidebar';
import DeleteNoteButton from './DeleteNoteButton';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {Preferences} from './types/Preferences';
import { Folder } from './types/Folder';
import FolderComponent from './FolderComponent';
import { useNavigate } from 'react-router-dom';
import ConfirmDeleteFolderModal from './ConfirmDeleteFolderModal';



function App() {

  const { user } = useAuth0();
  const [notes, setNotes] = useState<Note[]>([]);
  const [workingNote, setWorkingNote] = useState<Note>();
  const [confirmTitle, setConfirmTitle] = useState<boolean>(false);
  const [lastTitleChange, setLastTitleChange] = useState<Date>();
  const [disableDelete, setDisableDelete] = useState<boolean>(false);
  const [newNoteCooldown, setNewNoteCooldown] = useState<boolean>(false);
  const [showDeleteNoteModal, setShowDeleteNoteModal] = useState<boolean>(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState<boolean>(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder>();
  const [preferences, setPreferences] = useState<Preferences>();
  const [folders, setFolders] = useState<Folder[]>([]);
  const navigate = useNavigate();


  useEffect(()=>{
    if(user){
      console.log("successfully logged in as : " + user.email);
      refreshNoteList(true);
      getUserFolders(user?.email).then(result => setFolders(result.data));
    }
  },[user]);

  useEffect(()=>{

    const handleKeyDown = (event : KeyboardEvent) =>{
      if(event.key === 'Escape'){
        toggleDeleteModal();
        //window.blur();
      }
    }

    if(showDeleteNoteModal){
      window.addEventListener('keydown', handleKeyDown);
    }
    return () =>{
      window.addEventListener('keydown', handleKeyDown);
    }
  }, [showDeleteNoteModal])

  useEffect(()=>{
    //if there are no notes, we want to make a new one so the editor don't bug out!
    if(notes.length === 0){
      setTimeout(()=>
      {
        initializeNewNote();
      }, 100);
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
      }, 2000);
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

  function updateFolderName(folder : Folder, newName : string){
    const updatedFolders = folders;
    const folderToUpdate = updatedFolders.find((f :  Folder) => f._id === folder._id);
    if(folderToUpdate){
      folderToUpdate.name = newName;
      setFolders(updatedFolders);
      //store in DB
      updateFolder(user?.email, folderToUpdate);
    }

  }

  //for creating a new note in the database
  //will also refresh the note list
  function initializeNewNote(noteName? : string){
    if(newNoteCooldown) return;

    if(user?.email){
      console.log("New note!");
      createNote(user.email, noteName || "", "").then((response: any) => 
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
  
  function initializeNewFolder(folderName : string){

    if(user?.email){
      console.log("New folder!");
      createFolder(user.email, folderName).then((response: any) => 
      { 
        const newFolderObject : Folder = {_id: response.data.insertedId, name: folderName};
        setFolders(folders => [...folders, newFolderObject]);
        //add it to the notes state, and THEN set it as the working note!
        //setFolders(folders => [...folders, response?.data.newNote as Note]);
        //setWorkingNote(response?.data.newNote as Note);
        //performTitleChange();
        //refreshNoteList(false);
        //setNewNoteCooldown(true);
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

  function toggleDeleteFolderModal(folder : Folder){
    setShowDeleteFolderModal(true);
    setFolderToDelete(folder);
  }

  function handleDeleteFolder(folder : Folder){
    if(true){
      deleteFolder(user?.email, folder).then(res=>console.log(res?.data));
      setFolders(oldFolders => oldFolders.filter(f => f._id !== folder?._id));
      setShowDeleteFolderModal(false);
      setFolderToDelete(undefined);
    }
    else{return;}
  }


  //for rendering the existing notes in the sidebar!
  function renderNoteList(folders : Array<Folder>){

    function handleDragStart(event : any, note : any){
      event.dataTransfer.setData("application/json", JSON.stringify(note));
    }


    const elements = folders.map(folder => {
    
      const notesToRender = notes.filter(note => note.folder === folder._id);  
      const noteElements = notesToRender.map(note => (
        <div
        draggable onDragStart={(e) => handleDragStart(e, note)} className={`flex flex-row justify-start items-center pl-3 w-full cursor-pointer
        t gap-1 pe-2
        " + ${workingNote?._id === note._id ? 'bg-stone-100 font-semibold text-stone-950' : 'bg-transparent text-stone-500'}`} 
        onClick={()=>openNote(note?._id)}
        key={note?._id}>
          
          <div>
            <AiOutlineFileText className='w-4 h-4 text-stone-900'/>
            {/* <BsDot className='w-4 h-4 text-stone-900'/> */}
          </div>
          <div className='text-sm'>
            {note?.title}
          </div>
        </div>));

      return (
        <FolderComponent 
          key={folder?._id}
          folder={folder}
          notes={noteElements}
          updateFolderName={updateFolderName}
          moveNoteToFolder={moveNoteToFolder}
          toggleDeleteFolderModal={toggleDeleteFolderModal}
        />
      )
    })
    return elements;
  }

  function renderTopLevelNotes(){

    function handleDragStart(event : any, note : any){
      event.dataTransfer.setData("application/json", JSON.stringify(note));
    }

    return (
      notes.map(note => {
        
      if(note.folder === "")
      return <div
      draggable onDragStart={(e) => handleDragStart(e, note)} className={`flex flex-row justify-start items-center pl-3 w-full cursor-pointer
      t gap-1 pe-2
      " + ${workingNote?._id === note._id ? 'bg-stone-100 font-semibold text-stone-950' : 'bg-transparent text-stone-500'}`} 
      onClick={()=>openNote(note?._id)}
      key={note?._id}>
        
        {/* <div>
          <BsDot className='w-4 h-4 text-stone-900'/>
        </div> */}
        <AiOutlineFileText className='w-4 h-4 text-stone-900'/>
        <div>
          {note?.title}
        </div>
      </div>
      else
        return null
      })
      )
  }

  function toggleDeleteModal(){
    if(showDeleteNoteModal){
      setShowDeleteNoteModal(false);
    }
    else setShowDeleteNoteModal(true);
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
    if(workingNote){
      deleteNote(workingNote as Note, user?.email).then(res=>console.log(res.data?.success));
      setNotes(notes => notes.filter(note => note._id !== workingNote?._id));
      setDisableDelete(true);
      setShowDeleteNoteModal(false);
    }
    else{
      setDisableDelete(true);
    }
    //setWorkingNote(notes[0] || undefined);
  }

  function handleTitleInputKeyPress(event : any) {
    if(event.key === "Enter"){
      performTitleChange();
    }
  }

  function handlePreferenceUpdate(newPref : Preferences){
    console.log(newPref);
    setPreferences(old => newPref);
  }
  
  function moveNoteToFolder(folderID : string, note : Note){
    const updatedNotes = [...notes];
    const noteToChange = updatedNotes.find((aNote : Note) => aNote._id === note._id);
    if(noteToChange){
      noteToChange.folder = folderID;
      setNotes(updatedNotes);
      updateNote(noteToChange);
      //setFolders(old => old);
    }
    
  }

  function moveNoteOutOfFolder(note : Note){
    const updatedNotes = [...notes];
    const noteToChange = updatedNotes.find((aNote : Note) => aNote._id === note._id);
    if(noteToChange){
      noteToChange.folder = "";
      setNotes(updatedNotes);
      updateNote(noteToChange);
      //setFolders(old => old);
    }
    
  }


  if(!user){
    navigate("/login");
    return <></>;
  }
  
  return (
    <div className="App">
      <ConfirmDeleteModal showModal={showDeleteNoteModal} closeModal={toggleDeleteModal} deleteNote={handleDeleteNote} workingNoteTitle={workingNote?.title}/>
      <ConfirmDeleteFolderModal showModal={showDeleteFolderModal} closeModal={() => { setFolderToDelete(undefined); setShowDeleteFolderModal(false); } } 
      deleteFolder={handleDeleteFolder} folder={folderToDelete} />
      <div className='flex flex-row justify-start items-start w-full h-[100vh]'>
        <div className='sm:w-1/4 lg:w-3/12 xl:w-2/12 h-full'>
          <Sidebar moveNoteOutOfFolder={moveNoteOutOfFolder}  notes={notes}  renderTopLevelNotes={renderTopLevelNotes} folders={folders} initializeNewNote={initializeNewNote} renderNoteList={renderNoteList} newNoteCooldown={newNoteCooldown} pref={preferences} handlePref={handlePreferenceUpdate}
          initializeNewFolder={initializeNewFolder}/>
        </div>
        <div className={`flex-grow p-2 flex flex-col h-full ${preferences?.editorWidth  + " " + preferences?.editorPosition}`}>
          <div className='flex w-full justify-between items-center gap-3 pe-5 bg-stone-50'>
          <div className='w-3/4 max-w-[600px]'>
            <input className='text-3xl pt-1 outline-none w-full max-w-[600px] text-stone-950 bg-stone-50' maxLength={32} value={workingNote?.title} onChange={handleTitleInput}
            onKeyDown={handleTitleInputKeyPress}/>
            <div className='text-stone-400 text-[0.75rem] h-4'>
            {
              confirmTitle ?
              <>{32 - (workingNote?.title?.length || 0)} characters remaining...</>
              :
              <></>
            }
            </div>
          </div>
          {
          confirmTitle ?
          <button className='flex hover:bg-stone-200 px-2 py-1 rounded-lg content-center items-center' onClick={performTitleChange}>
            <AiOutlineCheck /> confirm
          </button>
          : 
          <></>
          }
      
          <DeleteNoteButton handleDeleteNote={toggleDeleteModal} disableDelete={disableDelete}/>
          </div>
            
            <TextEditor noteId={workingNote?._id} getNoteById={getNoteById} updateNoteContent={updateNoteContent}/>
          
          </div>

      </div>
    </div>

  );
}

export default App;

/**
 * 
 * return (
              <div className={`flex flex-row justify-start items-center pl-3 w-full cursor-pointer
              t gap-1 pe-2
              " + ${workingNote?._id === note._id ? 'bg-stone-100 font-semibold text-stone-950' : 'bg-transparent text-stone-500'}`} 
              onClick={()=>openNote(note?._id)}
              key={note?._id}
              >
                
                <div>
                  <BsDot className='w-4 h-4 text-stone-900'/>
                </div>
                <div>
                  {note?.title}
                </div>
              </div>
              )
 */