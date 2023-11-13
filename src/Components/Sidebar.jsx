import React, { useEffect, useState } from 'react';
import { AiOutlineFolder, AiOutlinePlus, AiOutlineFileText } from 'react-icons/ai';
import {AnimatePresence, motion} from 'framer-motion'
import SidebarPlaceholder from './Placeholder';
import EmptyListPlaceholder from './EmptyListPlaceholder';

const Sidebar = ({initializeNewNote, renderTopLevelNotes, renderNoteList, newNoteCooldown, handlePref, pref, folders, initializeNewFolder, notes, moveNoteOutOfFolder, setFolders, showNotePlaceholder, collapsed, toggleCollapsed,...props}) => {


  const [isHoveringAdd, setIsHoveringAdd] = useState(false);
  const [confirmAdd, setConfirmAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  //undefined/null for neither -> 0 for Note || 1 for Folder
  const [creationType, setCreationType] = useState();
  const [isCreating, setIsCreating] = useState(false);
  const [noteNameInput, setNoteNameInput] = useState("");
  const [folderNameInput, setFolderNameInput] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(()=>{
    if(notes && folders){
      const loadingTimeout = setTimeout(()=>{
        setLoading(false);

      }, 10);
      return ()=>{clearInterval(loadingTimeout);}
    };
  }, [notes, folders])

  useEffect(()=>{
    function handleOutsideClick(event){
      let sidebar = document.getElementById("sidebar");
      if(event.target !== sidebar){
        //toggleCollapsed();
      }
    }
    document.addEventListener("click", handleOutsideClick);

  }, [toggleCollapsed])

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
      if(event.target.value.length >= 4){
      initializeNewNote(event.target.value);
      setNoteNameInput("");
      setIsHoveringAdd(false);
      setIsCreating(false);
      setCreationType(2);
      setHasError(false);
      document.getElementById("sidebar").focus();
      }
      else{
        setHasError(true);
      }
    }
  }

  function handleNewFolderSubmit(event){
    if(event.key === "Enter"){
      if(event.target.value.length >= 4){
        initializeNewFolder(event.target.value);
        setFolderNameInput("");
        setIsHoveringAdd(false);
        setIsCreating(false);
        setCreationType(2);
        setHasError(false);
        document.getElementById("sidebar").focus();
      }
      else{
        setHasError(true);
      }
      //setFolderCreation(false);
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
    <motion.div id="sidebar" key="sidebar" className='absolute sm:relative w-2/3 sm:w-1/4 lg:w-3/12 xl:w-2/12 top-0 left-0 select-none h-full outline-none
    bg-stone-50 flex flex-col justify-start items-center pt-10 z-20' initial={{x:"-100%"}} animate={{x:0, transition:{type:"tween"}}} exit={{x:"-100%"}}>
    
          <div id="your-notes-section" className='flex flex-col justify-center items-start gap-0 mt-5 max-w-full w-full outline-none'>
            <div className='flex flex-row items-center text-lg text-stone-800 text-left gap-1 pl-3 outline-none'>
              <div className='font-bold text-xl text-stone-600 outline-none mb-2'>
                Notes
              </div>
            </div>
          <AnimatePresence mode='popLayout'>
          {
          loading ? 
          <SidebarPlaceholder/>: 
          <>
          {renderNoteList(folders)}
          <hr className='border-0 my-1'/>
          {renderTopLevelNotes(notes)}
          </>
          }
          
          </AnimatePresence>

          </div>
          <motion.div 
            onDrop={handleNoteDrop} onDragOver={(e)=>{e.preventDefault()}}
            onMouseEnter={() => setIsHoveringAdd(true)}
            onMouseLeave={() => {setIsHoveringAdd(false); setIsCreating(false); setCreationType(undefined); setNoteNameInput(""); setFolderNameInput(""); setHasError(false);}} onClick={() => {setIsCreating(true)}}
            className={`outline-none mt-5 flex flex-col h-[20%] w-full justify-start items-start ${newNoteCooldown ? 'display-none' : ''}`}>
              {
                showNotePlaceholder && !isHoveringAdd ?
                <EmptyListPlaceholder key="note-placeholder" />:<></>
              }
             {
              isHoveringAdd  && !newNoteCooldown  ? 
                <div className='w-full h-full'>
                  <AnimatePresence mode='popLayout'>

                  {
                    creationType === 0 ?
                    <motion.div key="note_input"  className='flex flex-col gap-1 justify-center items-start pl-3 text-base font-light text-stone-800'
                    initial={{y:"200%"}}
                    animate={{y:"0%"}}
                    exit={{y:-25, opacity:0}}
                    transition={{duration:0.4}}>
                      <div className='flex flex-row justify-start items-center'>
                      <AiOutlineFileText className='w-4 h-4'/>
                      <input autoFocus autoComplete="off" spellCheck="false" id="new-name-input" className='outline-none bg-transparent w-full' placeholder='Note Name...' maxLength={18} value={noteNameInput}
                      onChange={(e)=>{setNoteNameInput(e.target.value); if(e.target.value.length >=4)setHasError(false);}} onKeyDown={handleNewNoteSubmit}
                      />
                      </div>
                      {
                      hasError ?
                      <motion.div className='text-xs text-red-500 font-verylight pl-3'
                      initial={{opacity:0.5, y:-3}}
                      animate={{opacity:1, y:0}}>
                        Name must be at least 4 characters!
                      </motion.div> : <></>
                      }
                    </motion.div>
                    :
                    <></>
                  }
                  {
                    creationType === 1 ?
                    <motion.div key="folder_input" className='flex flex-col gap-1 justify-center items-start pl-3 text-base font-light text-stone-800'
                    initial={{y:"200%"}}
                    animate={{y:"0%"}}
                    transition={{duration:0.4}}
                    exit={{y:-25, opacity:0}}>
                    <div className='flex flex-row justify-start items-center'>
                    <AiOutlineFolder className='w-4 h-4'/>
                    <input autoComplete="off" spellCheck="false" autoFocus id="new-folder-input" className='outline-none bg-transparent w-full' placeholder='Folder Name...' maxLength={18} value={folderNameInput}
                    onChange={(e)=>{setFolderNameInput(e.target.value); if(e.target.value.length >=4)setHasError(false);}} onKeyDown={handleNewFolderSubmit}/>
                    </div>
                    {
                      hasError ?
                      <motion.div className='text-xs text-red-500 font-verylight pl-3'
                      initial={{opacity:0.5, y:-3}}
                      animate={{opacity:1, y:0}}>
                        Name must be at least 4 characters!
                      </motion.div> : <></>
                      }

                    </motion.div>
                    :
                    <></>
                  }

                  {(isCreating && creationType === undefined) ?
                    <motion.div key="create" className='flex flex-col h-full justify-around items-start pl-3 text-base font-light text-stone-800' >
                      <motion.div className='flex items-center gap-1 w-full h-1/2' onClick={() => {updateCreationType(0)}}
                      initial={{opacity:0.5}}
                      animate={{opacity:1, x:5}}
                      exit={{opacity:0, x:-20, transition:{duration:0.25}}}
                      transition={{duration:0.4}}>
                        <AiOutlineFileText className='w-4 h-4'/>
                        Note
                      </motion.div>
                      <motion.div className='flex items-center gap-1 w-full h-1/2' onClick={() => {updateCreationType(1)}}
                      initial={{opacity:0.5}}
                      animate={{opacity:1, x:5}}
                      exit={{opacity:0, x:-20, transition:{duration:0.25}}}
                      transition={{duration:0.4}}>
                      <AiOutlineFolder className='w-4 h-4'/>
                        Folder
                      </motion.div>
                    </motion.div>
                    :
                    <></>
                  }
                  {!isCreating ?

                  <motion.div key="create_new" className='flex justify-start items-center gap-1 pl-3 text-sm font-light text-stone-600' 
                    initial={{opacity:0}}
                    animate={{x:5, opacity:1, transition:{duration:0.5}}}
                    exit={{x:125, opacity:0}} transition={{duration:0.5}}>
                      <AiOutlinePlus className='w-3 h-3 text-stone-600'/>
                      create new
                    </motion.div>
                     :
                     <></>
                    }

                </AnimatePresence>
                </div>
                
                : 
                <></>
            }
          </motion.div>
        </motion.div>
  )}

export default Sidebar