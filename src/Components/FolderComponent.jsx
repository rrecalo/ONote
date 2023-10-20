/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { AiOutlineFolder, AiFillDelete, AiOutlineFolderOpen, AiOutlineCheck } from 'react-icons/ai'
import { HiOutlinePencil } from 'react-icons/hi'
import {AnimatePresence, motion} from 'framer-motion'

const FolderComponent = ({folder, notes, updateFolderName, moveNoteToFolder, toggleDeleteFolderModal, handleDropOnFolder, updateFolderState, ...props}) => {

  const [folderName, setFolderName] = useState(folder?.name);
  const [ originalName, setOriginalName] = useState(folder?.name);
  const [editingName, setEditingName] = useState(false);
  const [lastNameChange, setLastNameChange] = useState();
  const [isHover, setHover] = useState();
  const myInputRef = useRef(null);
  const [expanded, setExpanded] = useState(folder.opened);
  const [inputError, setInputError] = useState("");

  useEffect(()=>{
    const changeFolderNameInterval = setTimeout(()=>{
      if(lastNameChange){
        changeFolderName();
        }
    }, 5000);
    return () => clearInterval(changeFolderNameInterval);
  },[lastNameChange])

  useEffect(()=>{
    if(editingName){
      if(myInputRef.current){
        myInputRef.current.focus();
      }
    }
  },[editingName]);

  useEffect(()=>{
    if(folderName.length <= 3){
      setInputError("Unsaved changes...name must be at least 4 characters");
    }
    else if(folderName.length >= 4 && inputError){
      setInputError("");
    }
  }, [folderName])

  useEffect(()=>{
    const editingTimeout = setTimeout(()=>{
      if(editingName && !lastNameChange){
        setLastNameChange(undefined);
        setEditingName(false);
        console.log("timeout!");
        console.log(lastNameChange);
      }
    }, 3000);
    return () => clearInterval(editingTimeout);
  }, [editingName]);


  useEffect(()=>{
    if(expanded !== undefined && expanded !== null)
      updateFolderState(folder, expanded);
  }, [expanded])

  function changeFolderName(){
    if(folderName.length > 3 && folder){
      updateFolderName(folder, folderName);
      setOriginalName(folderName);
      setLastNameChange(undefined);
      setEditingName(false);
    }
    else{
      discardNameChanges();
    }

  };

  function discardNameChanges(){
    setFolderName(originalName);
    setLastNameChange(undefined);
    setEditingName(false);
  }

  function handleFolderNameInputChange(event){

    setLastNameChange(new Date());
    setFolderName(event.target.value);
    event.preventDefault();
  }

  function toggleEditingName(event){
    event.stopPropagation();
    if(editingName){
        setEditingName(false);
    }
    else {
        setEditingName(true);
        setLastNameChange(new Date());
    }
  }

  function handleInputKeyDown(event){
    if(event.key === "Enter"){
      if(folderName.length <= 3) return;
      else{
        changeFolderName();
      }
    }
    else if(event.key === "Escape"){
      discardNameChanges();
    }
  }
  
  function handleDeleteClicked(event){
    event.stopPropagation();
    toggleDeleteFolderModal(folder);
  }

  function toggleExpanded(){
    if(!editingName){
      if(expanded){
        setExpanded(false);
      }
      else setExpanded(true);
    }
  }

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };



  return (
    <motion.div
    layout="position"
    key={folder?._id}
    initial={{opacity:0, x:25}}
    animate={{opacity:1, x:0}}
    transition={{duration:0.25}}
    className={`text-stone-600 w-full cursor-pointer
    t gap-1 mt-1 text-base select-none`} 
    // onDrop={handleDrop} 
    // onDragOver={(e)=>{e.preventDefault()}}
    onClick={toggleExpanded}
    draggable
    onDragStart={(e) => handleDragStart(e, folder?.order)}
    onDragOver={(e) => handleDragOver(e, folder?.order)}
    onDrop={(e) => handleDropOnFolder(e, folder?.order)}
    >
      <motion.div className='flex justify-start items-center w-full gap-2 cursor-default pl-3 pe-2'
      initial={{backgroundColor: "#fafaf9"}}
      animate={{backgroundColor: "#fafaf9"}}
      whileHover={{backgroundColor: "#e7e5e4", x:1}}
      transition={{type:"tween", duration:0.1, ease:"linear"}}>
        {expanded ? 
        <AiOutlineFolderOpen className='text-stone-600 w-4 h-4'/>
        :
        <AiOutlineFolder className='text-stone-600 w-4 h-4'/>
        }
      {/* <input value={folderName} minLength={1} className='outline-none'
      onChange={handleFolderNameInputChange}/>
       */}
      <div className='flex justify-start items-center w-full' 
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        
        <div className='w-full'>
          {
          editingName ? 
          <input type="text" ref={myInputRef} spellCheck={false} className={`bg-transparent outline-none w-full`} maxLength={18} value={folderName} onChange={handleFolderNameInputChange}
          onKeyDown={handleInputKeyDown}/>
          :
          <div className='w-auto'>
            {folderName}
          </div>
          } 

        </div>
        <div className='flex justify-center items-center w-8'>
        {
        isHover ?
        <div className='flex w-full h-full justify-start gap-1 items-start'>
          <AiFillDelete className='text-stone-600' onClick={handleDeleteClicked}/>
          {
            !editingName ?
          <HiOutlinePencil className='text-stone-500' onClick={toggleEditingName}/>
          :
          <AiOutlineCheck className='text-stone-500' onClick={toggleEditingName}/>
          }
        </div>
        : <></>
        }
        </div>
      </div>
      
      </motion.div>
      {inputError !== "" ?
      <motion.p className='pl-8 text-red-600 text-[0.75rem] w-full' initial={{x:-5, opacity:0.5}} animate={{x:0, opacity:1}}
      >{inputError}</motion.p>
      : <></> }
      <hr className='ml-3 border-0 py-[0.5px] bg-stone-200'/>
      <div className='pl-3'>
        <AnimatePresence >
        {expanded ? notes :
        <></>}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default FolderComponent;