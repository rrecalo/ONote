import React, {useEffect, useState, useRef} from 'react';
import PreferenceSelector from './PreferenceSelector';
import { AiOutlineFolder, AiOutlineFolderAdd, AiOutlinePlus, AiOutlineFileText } from 'react-icons/ai';

const Sidebar = ({initializeNewNote, renderTopLevelNotes, renderNoteList, newNoteCooldown, handlePref, pref, folders, initializeNewFolder, notes, moveNoteOutOfFolder, ...props}) => {


  const [isHoveringAdd, setIsHoveringAdd] = useState(false);
  const [confirmAdd, setConfirmAdd] = useState(false);
  //undefined/null for neither -> 0 for Note || 1 for Folder
  const [creationType, setCreationType] = useState();
  const [isCreating, setIsCreating] = useState(false);
  const [noteNameInput, setNoteNameInput] = useState("");
  const [folderNameInput, setFolderNameInput] = useState("");

  useEffect(()=>{
    if(confirmAdd){
      const confirmAddTimeout = setTimeout(()=>{
        setConfirmAdd(false)
      }, 2000);
      return () => clearInterval(confirmAddTimeout);
    }
  },[confirmAdd]);

  function handleNewNoteSubmit(event){
    if(event.key === "Enter"){
      initializeNewNote(event.target.value);
      //setNoteCreation(false);
      setNoteNameInput("");
    }
  }

  function handleNewFolderSubmit(event){
    if(event.key === "Enter"){
      initializeNewFolder(event.target.value);
      //setFolderCreation(false);
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

  function updateCreationType(choice){
    setCreationType(choice)
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
            onMouseLeave={() => {setIsHoveringAdd(false); setIsCreating(false); setCreationType(undefined);}}
            onClick={() => {setIsCreating(true)}}
            className={`mt-5 flex h-[10%] w-full justify-center items-start ${newNoteCooldown ? 'display-none' : ''}`}>
             {
              isHoveringAdd  && !newNoteCooldown  ? 
                <div className='w-full h-full'>
                  {/* <div onClick={handleNewNoteClick} className='flex justify-start items-start bg-stone-100 w-full h-1/2'>
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
                  </div> */}
                  {
                    creationType === 0 ?
                    <div className='flex flex-row gap-1 justify-start items-center pl-3 text-base font-light text-stone-800'>
                      <AiOutlineFileText className='w-4 h-4'/>
                      <input autoFocus id="new-name-input" className='outline-none bg-transparent' placeholder='Note Name...' maxLength={18} value={noteNameInput}
                      onChange={(e)=>setNoteNameInput(e.target.value)} onKeyDown={handleNewNoteSubmit}/>
                    </div>
                    :
                    <></>
                  }
                  {
                    creationType === 1 ?
                    <div className='flex flex-row gap-1 justify-start items-center pl-3 text-base font-light text-stone-800'>
                    <AiOutlineFolder className='w-4 h-4'/>
                    <input autoFocus id="new-folder-input" className='outline-none bg-transparent' placeholder='Folder Name...' maxLength={18} value={folderNameInput}
                    onChange={(e)=>setFolderNameInput(e.target.value)} onKeyDown={handleNewFolderSubmit}/>
                    </div>
                    :
                    <></>
                  }

                  {(isCreating && creationType === undefined) ?
                    <div className='flex flex-col h-full justify-start items-start pl-3 text-base font-light text-stone-800' >
                      <div className='flex items-center gap-1 w-full p-1' onClick={() => {updateCreationType(0)}}>
                        <AiOutlineFileText className='w-4 h-4'/>
                        Note
                      </div>
                      <div className='flex items-center gap-1 w-full p-1' onClick={() => {updateCreationType(1)}}>
                      <AiOutlineFolder className='w-4 h-4'/>
                        Folder
                      </div>
                    </div>
                    :
                    <></>
                  }
                  {!isCreating ?
                    <div className='flex justify-start items-center gap-1 pl-3 text-sm font-light text-stone-600' >
                      <AiOutlinePlus className='w-3 h-3 text-stone-600'/>
                      create new
                    </div>
                    :
                    <></>
                  }
                  
                </div>
                : 
                <></>
            }
          </div>
        </div>
  )}

export default Sidebar