import React, {useEffect, useState} from 'react';
import {AiOutlineFileText, AiOutlinePlus} from 'react-icons/ai';
import PreferenceSelector from './PreferenceSelector';

const Sidebar = ({initializeNewNote, renderTopLevelNotes, renderNoteList, newNoteCooldown, handlePref, pref, folders, initializeNewFolder, notes, moveNoteOutOfFolder, ...props}) => {

  const [isHoveringAdd, setIsHoveringAdd] = useState(false);
  const [confirmAdd, setConfirmAdd] = useState(false);
  const [folderCreation, setFolderCreation] = useState(false);
  const [noteCreation, setNoteCreation] = useState(false);
  const [noteNameInput, setNoteNameInput] = useState("");
  const [folderNameInput, setFolderNameInput] = useState("");
  const [children, setChildren] = useState([]);
  
  useEffect(()=>{
    setChildren(renderNoteList(folders));
  }, [notes, folders])

  useEffect(()=>{
    if(confirmAdd){
      const confirmAddTimeout = setTimeout(()=>{
        setConfirmAdd(false)
      }, 2000);
      return () => clearInterval(confirmAddTimeout);
    }
  },[confirmAdd]);

  function handleNewNoteClick(event){
    event.preventDefault();
    if(!noteCreation){
      setNoteCreation(true);
      if(folderCreation) setFolderCreation(false);
    }
  }

  function handleNewFolderClick(event){
    event.preventDefault();
    if(!folderCreation){
      setFolderCreation(true);
      if(noteCreation) setNoteCreation(false);
    }
  }

  function handleNewNoteSubmit(event){
    if(event.key === "Enter"){
      initializeNewNote(event.target.value);
      setNoteCreation(false);
      setNoteNameInput("");
    }
  }

  function handleNewFolderSubmit(event){
    if(event.key === "Enter"){
      initializeNewFolder(event.target.value);
      setFolderCreation(false);
      setFolderNameInput("");
    }
  }
  function handleFolderDrop(event){
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("application/json"));
    if(data.folder !== ""){
      moveNoteOutOfFolder(data);
      console.log("note from a folder!");
    }
    else console.log("note from no folder!");
  }

  return (
    <div id="sidebar" className='select-none w-full h-full 
    bg-stone-50 flex flex-col justify-start items-center pt-10'
    
    >
          {/*
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
          */}
          <div className='h-10'>
          <PreferenceSelector handlePreferenceChange={handlePref} preferences={pref}/>
          </div>
          <div id="your-notes-section" className='flex flex-col justify-center items-start gap-1 mt-5 max-w-full w-full'>
            <div className='flex flex-row items-center text-lg text-stone-800 text-left gap-1 pl-3'>
              <div className='font-bold text-xl text-stone-600'>
                Notes
              </div>
            </div>
          {renderNoteList(folders)}
          {renderTopLevelNotes(notes)}
          </div>
          <div 
            onDrop={handleFolderDrop} onDragOver={(e)=>{e.preventDefault()}}
            onMouseEnter={() => setIsHoveringAdd(true)}
            onMouseLeave={() => {setIsHoveringAdd(false); setNoteCreation(false); setFolderCreation(false);}}
            className={`mt-10 flex h-[20%] w-full justify-center items-start ${newNoteCooldown ? 'display-none' : ''}`}>
             {
              isHoveringAdd  && !newNoteCooldown  ? 
                <div className='w-full h-full'>
                  <div onClick={handleNewNoteClick} className='flex justify-center items-center bg-stone-100 w-full h-1/2'>
                  {noteCreation ?
                  <input className='outline-none' placeholder='Note Name...' maxLength={18} value={noteNameInput}
                  onChange={(e)=>setNoteNameInput(e.target.value)} onKeyDown={handleNewNoteSubmit}/>
                  :
                  <>New Note</>
                  }
                  </div>
                  
                  <div onClick={handleNewFolderClick} className='flex justify-center items-center bg-stone-100 w-full h-1/2'>
                  {folderCreation ?
                  <input className='outline-none' placeholder='Folder Name...' maxLength={18} value={folderNameInput}
                  onChange={(e)=>setFolderNameInput(e.target.value)} onKeyDown={handleNewFolderSubmit}/>
                  :
                  <>New Folder</>
                  }
                  </div>
                  
                </div>
                : 
                <></>
            }
          </div>
        </div>
  )}

export default Sidebar