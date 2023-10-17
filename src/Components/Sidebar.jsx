import React, {useEffect, useState, useRef} from 'react';
import PreferenceSelector from './PreferenceSelector';
import { AiOutlineFolder, AiOutlinePlus, AiOutlineFileText } from 'react-icons/ai';

const Sidebar = ({initializeNewNote, renderTopLevelNotes, renderNoteList, newNoteCooldown, handlePref, pref, folders, initializeNewFolder, notes, moveNoteOutOfFolder, setFolders, ...props}) => {


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
  function handleNoteDrop(event){
    event.preventDefault();
    if(event.dataTransfer.types.includes("application/json")){
    const data = JSON.parse(event?.dataTransfer?.getData("application/json"));
    if(data?.folder !== ""){
      moveNoteOutOfFolder(data);
      console.log("note from a folder!");
    }
    else console.log("note from no folder!");
    }
  }

  function updateCreationType(choice){
    setCreationType(choice)
  }

  return (
    <div id="sidebar" className='select-none w-full h-full 
    bg-stone-50 flex flex-col justify-start items-center pt-10'>

          <div className='h-10'>
          <PreferenceSelector handlePreferenceChange={handlePref} preferences={pref}/>
          </div>
          <div id="your-notes-section" className='flex flex-col justify-center items-start gap-0 mt-5 max-w-full w-full'>
            <div className='flex flex-row items-center text-lg text-stone-800 text-left gap-1 pl-3'>
              <div className='font-bold text-xl text-stone-600'>
                Notes
              </div>
            </div>
          {renderNoteList(folders)}
          {renderTopLevelNotes(notes)}
          </div>
          <div 
            onDrop={handleNoteDrop} onDragOver={(e)=>{e.preventDefault()}}
            onMouseEnter={() => setIsHoveringAdd(true)}
            onMouseLeave={() => {setIsHoveringAdd(false); setIsCreating(false); setCreationType(undefined);}}
            onClick={() => {setIsCreating(true)}}
            className={`mt-5 flex h-[20%] w-full justify-center items-start ${newNoteCooldown ? 'display-none' : ''}`}>
             {
              isHoveringAdd  && !newNoteCooldown  ? 
                <div className='w-full h-full'>
                  {
                    creationType === 0 ?
                    <div className='flex flex-row gap-1 justify-start items-center pl-3 text-base font-light text-stone-800'>
                      <AiOutlineFileText className='w-4 h-4'/>
                      <input autoFocus id="new-name-input" className='outline-none bg-transparent w-full' placeholder='Note Name...' maxLength={18} value={noteNameInput}
                      onChange={(e)=>setNoteNameInput(e.target.value)} onKeyDown={handleNewNoteSubmit}/>
                    </div>
                    :
                    <></>
                  }
                  {
                    creationType === 1 ?
                    <div className='flex flex-row gap-1 justify-start items-center pl-3 text-base font-light text-stone-800'>
                    <AiOutlineFolder className='w-4 h-4'/>
                    <input autoFocus id="new-folder-input" className='outline-none bg-transparent w-full' placeholder='Folder Name...' maxLength={18} value={folderNameInput}
                    onChange={(e)=>setFolderNameInput(e.target.value)} onKeyDown={handleNewFolderSubmit}/>
                    </div>
                    :
                    <></>
                  }

                  {(isCreating && creationType === undefined) ?
                    <div className='flex flex-col h-full justify-around items-start pl-3 text-base font-light text-stone-800' >
                      <div className='flex items-center gap-1 w-full h-1/2' onClick={() => {updateCreationType(0)}}>
                        <AiOutlineFileText className='w-4 h-4'/>
                        Note
                      </div>
                      <div className='flex items-center gap-1 w-full h-1/2' onClick={() => {updateCreationType(1)}}>
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