import React , {useEffect, useState} from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import TextEditor from '../Components/TextEditor';
import {getUserNotes, createNote, deleteNote, getUserFolders, saveFolderName, saveFolderState, createFolder, deleteFolder, updateUserFolders, getUserPrefs, updateUserPrefs, getUser, updateUserLastNote} from '../api/userAPI';
import { Note } from '../types/Note'
import { updateNote } from '../api/userAPI';
import {AiOutlineCheck, AiOutlineFileText } from 'react-icons/ai';
import Sidebar from '../Components/Sidebar';
import ConfirmDeleteModal from '../Components/ConfirmDeleteModal';
import {EditorPosition, EditorWidth, Preferences} from '../types/Preferences';
import { Folder } from '../types/Folder';
import FolderComponent from '../Components/FolderComponent';
import { useNavigate } from 'react-router-dom';
import ConfirmDeleteFolderModal from '../Components/ConfirmDeleteFolderModal';
import { AnimatePresence, MotionProps, motion } from 'framer-motion';
import NoteComponent from '../Components/NoteComponent';
import PreferenceSelector from '../Components/PreferenceSelector';



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
  const [noteNameInputError, setNoteNameInputError] = useState(0);
  const [changesPrompt, setChangesPrompt] = useState(0);
  const navigate = useNavigate();

  const changeVariants = {
    initial:{
      opacity:0,
      y:-5,
    },
    animate:{
      opacity:1,
      y:0,
      transition:{duration:0.6}
    },
    exit:{
      opacity:0,
      y:5,
      transition:{duration:0.3}
    }
  }


  useEffect(()=>{
    if(user){
      console.log("successfully logged in as : " + user.email);
      getUserPrefs(user?.email).then(res =>{
        if(res?.data?.editorWidth === "full"){
          setPreferences({editorWidth: "full", editorPosition: "center"});
        }
        else if(res?.data?.editorWidth === "half"){
          setPreferences({editorWidth: "half", editorPosition: "center"});
        }
      });
      refreshNoteList(true);
    }
  },[user]);

  useEffect(()=>{
    if(changesPrompt === 0){
      const hideChanges = setTimeout(()=>{

        setChangesPrompt(2);
      }, 3000)
      return () => {clearInterval(hideChanges)};
    };
  }, [changesPrompt])

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

  useEffect(()=>{
    if(workingNote){
      if(workingNote?.title?.length < 4){
        setNoteNameInputError(1);
      }
      else setNoteNameInputError(0);
    }
  },[workingNote?.title])

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
  function refreshNoteList(loadLastNote: boolean){
    getUserNotes(user?.email).then((response: any)=>{
      getUserFolders(user?.email).then(result =>{
      let fetchedFolders = result.data.sort((a : Folder, b : Folder) => a.order - b.order);
      let fetchedNotes = response.data;
      fetchedNotes = fetchedNotes?.sort((a : Note, b : Note) => a?.index - b.index);

      setNotes(fetchedNotes);
      setFolders(fetchedFolders);
      if(loadLastNote){
      getUser(user?.email).then(res =>{
        if(res.data.lastNote){
          setWorkingNote(fetchedNotes.filter((a : Note) => a._id === res.data.lastNote)[0] || fetchedNotes[0]);
        }
      });
      }
    });
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
      //updateNote(noteToUpdate as Note);
      //saveNoteContent(noteToUpdate._id);
    }
    
  }

  function saveNoteContent(id: string){
    const noteToSave = notes.find((note : Note) => note._id === id);
    updateNote(noteToSave as Note);
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
      saveFolderName(user?.email, folderToUpdate);
    }
  }

  function updateFolderState(folder : Folder, newState : boolean){
    const updatedFolders = folders;
    const folderToUpdate = updatedFolders.find((f :  Folder) => f._id === folder._id);
    if(folderToUpdate){
      folderToUpdate.opened = newState;
      //store in DB
      saveFolderState(user?.email, folderToUpdate);
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
        const newFolderObject : Folder = {_id: response.data.insertedId, name: response.data.folderName, order: response.data.index, opened: response.data.opened};
        setFolders(folders => [...folders, newFolderObject]
          .sort((a : Folder, b : Folder) => a.order - b.order ));
      });

    }
  }

  //set the new working note to be the one with the matching id parameter
  function openNote(id: string){
    if(workingNote){
      saveNoteContent(workingNote._id);
      setChangesPrompt(2);
    }
    setWorkingNote(notes.find((note : Note) => note._id === id));
    setChangesPrompt(2);
    updateUserLastNote(user?.email, id);
    
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


  function handleReorderFolder(event: any, thisNote : Note){
    //console.log(thisNote);
    if(event.dataTransfer.types.includes("application/json")){
      const data = JSON.parse(event.dataTransfer.getData("application/json"));
      let droppedNote = data as Note;
      if(droppedNote.folder === thisNote.folder && droppedNote._id !== thisNote?._id){
        event.stopPropagation();
        swapNoteIndices(thisNote, data as Note);
      }
      else return;
    }
  }

  function handleDragStart(event : any, note : any){
    event.dataTransfer.setData("application/json", JSON.stringify(note));
  }

  //for rendering the existing notes in the sidebar!
  function renderNoteList(folders : Array<Folder>){

    const elements = folders.map((folder, index) => {
      
      const handleDropOnFolder = (e : any, targetIndex : any) => {
        e.preventDefault();

        if(e.dataTransfer.types.includes("application/json")){
          const data = JSON.parse(e.dataTransfer.getData("application/json"));
          if(data.folder !== folder?._id){
            moveNoteToFolder(folder?._id, data);
           // console.log("note from other folder!");
          }
          else console.log("note from current folder!");
            return;
        }
        const sourceIndex = e.dataTransfer.getData('index');
        if(targetIndex !== parseInt(sourceIndex)){
        //console.log(folder?.order);
        //console.log(sourceIndex);
        const updatedFolders = [...folders];
    
        // Reorder the items in the array
        const [draggedItem] = updatedFolders.splice(sourceIndex, 1);
        updatedFolders.splice(targetIndex, 0, draggedItem);
        updatedFolders.forEach((folder, index) => folder.order = index);
        //console.log(updatedFolders);
        
        updateUserFolders(user?.email, updatedFolders);
        setFolders(updatedFolders);
        //setItems(updatedItems);
        }
      };
      const notesToRender = notes.filter(note => note.folder === folder._id);  
      notesToRender.sort((a : Note, b : Note) => a.index - b.index);
      const noteElements = notesToRender.map(note => (
        <NoteComponent 
        handleDragStart={handleDragStart}
        handleReorderFolder={handleReorderFolder}
        workingNote={workingNote}
        note={note}
        openNote={openNote}
        handleDeleteNote={toggleDeleteModal}
        />));


      return (
        <FolderComponent 
      key={folder?._id}
      folder={folder}
      notes={noteElements}
      updateFolderName={updateFolderName}
      moveNoteToFolder={moveNoteToFolder}
      toggleDeleteFolderModal={toggleDeleteFolderModal}
      setFolders={setFolders}
      handleDropOnFolder={handleDropOnFolder}
      updateFolderState={updateFolderState}
      />
      )
    })
    return elements;
  }

  function renderTopLevelNotes(){

    return (
      notes.sort((a: Note, b: Note) => a.index - b.index).map(note => {
      if(note.folder === "")
      return <NoteComponent 
      handleDragStart={handleDragStart}
      handleReorderFolder={handleReorderFolder}
      workingNote={workingNote}
      note={note}
      openNote={openNote}
      handleDeleteNote={toggleDeleteModal}
      />
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
    setLastTitleChange(new Date());
    setConfirmTitle(true);
    setWorkingNote({...workingNote, title: event?.target.value} as Note);
  }

  //confirms the title change by changing the value in the notes state and the DB
  function performTitleChange(){
    if(workingNote && workingNote?.title?.length > 3){
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
  }

  function handleTitleInputKeyPress(event : any) {
    if(event.key === "Enter"){
      performTitleChange();
    }
    else if(event.key === "Escape"){
      window.blur();
    }
  }

  function handlePreferenceUpdate(newPref : Preferences){
    setPreferences(newPref);
    let userPrefs = {
      editorWidth : newPref.editorWidth,
      editorPosition : newPref.editorPosition
    }
    updateUserPrefs(user?.email, userPrefs);
  }
  
  function swapNoteIndices(targetedNote : Note, droppedNote : Note){
    let index = targetedNote.index;
    targetedNote.index=droppedNote.index;
    droppedNote.index = index;
    let notesCopy = [...notes];
    // Reorder the items in the array
    let folder = notesCopy.filter(note=>note?.folder === targetedNote.folder);
    let target = folder.find(note=>note?._id===targetedNote?._id);
    let dropped = folder.find(note=>note?._id===droppedNote?._id);
    const [dragged] = folder.splice(folder.indexOf(dropped as Note), 1);
    folder.splice(folder.indexOf(target as Note), 0, dragged);
    folder.forEach((item, index) => item.index = index);

    setNotes([...notesCopy.filter(note=>note?.folder !== targetedNote.folder), ...folder]);
    
    folder.forEach(note=>
      updateNote(note));

  }

  function moveNoteToFolder(folderID : string, note : Note){
    let notesCopy = [...notes];
    const noteToChange = notesCopy.find((aNote : Note) => aNote._id === note._id);
    if(noteToChange){
      noteToChange.folder = folderID;
      let updatedNotes = assignNewNoteIndices(notesCopy);
      let updatedNote = updatedNotes.find(note=>note?._id===noteToChange._id);

      if(updatedNote){
        updatedNote.index = countNotesInFolder(folderID);
        setNotes(updatedNotes);
        updatedNotes.forEach(note=>{
          updateNote(note);
        })
      }
    }
  }

  function countNotesInFolder(folderID : string){
    return notes.filter(note=>note.folder === folderID).length;
  }

  function assignNewNoteIndices(notes: Array<Note>){
    let notesCopy : Note[] = [];
    folders.forEach(folder=>{
      let notesInFolder = notes.filter(note => note.folder === folder._id);
      notesInFolder.forEach((note, index) =>{
        note.index = index;
      })
      notesCopy.push(...notesInFolder);
    });
    notesCopy.push(...notes.filter(note=>note.folder===""));
    return notesCopy;
  }

  function moveNoteOutOfFolder(note : Note){
    const notesCopy = [...notes];
    const noteToChange = notesCopy.find((aNote : Note) => aNote._id === note._id);
    if(noteToChange){
      noteToChange.folder = "";
      let updatedNotes = assignNewNoteIndices(notesCopy);
      let updatedNote = updatedNotes.find(note=>note?._id===noteToChange._id);

      if(updatedNote){
        updatedNote.index = countNotesInFolder("");
        setNotes(updatedNotes);
        updatedNotes.forEach(note=>{
          updateNote(note);
        })
      }
    }
    
  }


  if(!user){
    navigate("/login");
    return <></>;
  }
  
  return (
    <div className="App">
      <PreferenceSelector handlePreferenceChange={handlePreferenceUpdate} preferences={preferences}/>
      <ConfirmDeleteModal showModal={showDeleteNoteModal} closeModal={toggleDeleteModal} deleteNote={handleDeleteNote} workingNoteTitle={workingNote?.title}/>
      <ConfirmDeleteFolderModal showModal={showDeleteFolderModal} closeModal={() => { setFolderToDelete(undefined); setShowDeleteFolderModal(false); } } 
      deleteFolder={handleDeleteFolder} folder={folderToDelete} />
      <div className='flex flex-row justify-start items-start w-full h-[100vh]'>
        <div className='sm:w-1/4 lg:w-3/12 xl:w-2/12 h-full'>
          <Sidebar setFolders={setFolders} moveNoteOutOfFolder={moveNoteOutOfFolder}  notes={notes}  renderTopLevelNotes={renderTopLevelNotes} folders={folders} initializeNewNote={initializeNewNote} renderNoteList={renderNoteList} newNoteCooldown={newNoteCooldown} pref={preferences} handlePref={handlePreferenceUpdate}
          initializeNewFolder={initializeNewFolder}/>
        </div>
        {/* ${preferences?.editorWidth  + " " + preferences?.editorPosition} */}
        <motion.div className={`flex-grow p-2 flex flex-col h-full ${
          (preferences?.editorWidth === "full" ? EditorWidth.full : EditorWidth.half)  + " " + 
          (preferences?.editorPosition === "center" ? EditorPosition.center : EditorPosition.start)}`}>
          <motion.div className='flex justify-between items-center gap-3 mt-5 pe-5 bg-transparent w-11/12'
          layout="position" initial={{width:"full"}} animate={{width:"full"}} transition={{duration:0.35}}>
          <div className='w-full'>
            <input
            spellCheck={false} className='select-none text-3xl pt-1 outline-none w-full text-stone-950' maxLength={28} value={workingNote?.title} onChange={handleTitleInput}
            onKeyDown={handleTitleInputKeyPress}/>
            <motion.div 
             className={`text-[0.75rem] h-4 ${noteNameInputError === 1 ? 'text-red-600' : 'text-stone-400'}`}>
            {
              (confirmTitle && noteNameInputError !== 1) ?
              <motion.div
              initial={{opacity:0.5, y:-3}} 
              animate={{opacity:1, y:0}}
              >{28 - (workingNote?.title?.length || 0)} characters remaining...</motion.div>
              :
              <></>
            }
            {noteNameInputError === 1 ?
            <motion.div
            initial={{opacity:0.5, y:-3}} 
            animate={{opacity:1, y:0}}>Please enter at least {4 - (workingNote?.title?.length || 0)} more character{workingNote?.title?.length === 3 ? '' : 's'}...</motion.div>
            :
            <></>}
            </motion.div>
          </div>
          <div className='flex gap-2 justify-end items-center w-1/2'>
            <AnimatePresence mode='popLayout'>
            {
            confirmTitle ?
            <motion.button
            layout="position"
            key="confirm_title_button" className='flex hover:bg-stone-200 px-2 py-1 rounded-md content-center items-center' onClick={performTitleChange}
            initial={{opacity:0, y:-3}}
            animate={{opacity:1, y:0}}
            exit={{opacity:0, y:-3}}>
              <AiOutlineCheck /> save title 
            </motion.button>
            : 
            <></>
            }
            {
              changesPrompt === 0 ?
              <motion.div layout="position" key="saved_changes" variants={changeVariants} initial="initial" animate="animate" exit="exit">changes saved</motion.div>
              : changesPrompt === 1 ?
              <motion.div layout="position" key="unsaved_changes" variants={changeVariants} initial="initial" animate="animate" exit="exit">unsaved changes</motion.div>
              : <motion.div layout="position" key="no_changes"></motion.div>
            }
            </AnimatePresence>
          </div>
          </motion.div>
            <TextEditor noteId={workingNote?._id} getNoteById={getNoteById} updateNoteContent={updateNoteContent} setChangesPrompt={setChangesPrompt} 
            saveNoteContent={saveNoteContent}/>
          </motion.div>

      </div>
    </div>

  );
}

export default App;
