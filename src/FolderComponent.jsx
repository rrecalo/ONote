import React, { useState, useEffect, useRef } from 'react'
import { AiOutlineFolder, AiFillDelete } from 'react-icons/ai'
import { HiOutlinePencil } from 'react-icons/hi'

const FolderComponent = ({folder, notes, updateFolderName, moveNoteToFolder, toggleDeleteFolderModal, ...props}) => {

  const [folderName, setFolderName] = useState(folder?.name);
  const [editingName, setEditingName] = useState(false);
  const [lastNameChange, setLastNameChange] = useState();
  const [isHover, setHover] = useState();
  const myInputRef = useRef(null);


  useEffect(()=>{
    const changeFolderNameInterval = setTimeout(()=>{
      if(lastNameChange){
        changeFolderName();
        }
    }, 3000);
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
    const saveFolderInterval = setTimeout(()=>{
      if(lastNameChange){
        changeFolderName();
      }
    }, 3000);
    return () => clearInterval(saveFolderInterval);
  }, [lastNameChange]);


  function changeFolderName(){
    if(folderName && folder){
      updateFolderName(folder, folderName);
    }
  };

  function handleFolderNameInputChange(event){
    setLastNameChange(new Date());
    setFolderName(event.target.value);
    event.preventDefault();
  }

  function toggleEditingName(){
    if(editingName){
        setEditingName(false);
    }
    else {
        setEditingName(true);
    }
  }

  function handleInputKeyDown(event){
    if(event.key === "Enter"){
      changeFolderName();
      setEditingName(false);
    }
  }

  function handleDrop(event){
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("application/json"));
    if(data.folder !== folder?._id){
      moveNoteToFolder(folder?._id, data);
      console.log("note from other folder!");
    }
    else console.log("note from current folder!");
  }

  function handleDeleteClicked(){
    toggleDeleteFolderModal(folder);
  }

  return (
    <div className={`text-stone-600 pl-3 w-full cursor-pointer
    t gap-1 pe-2 mt-1 text-base select-none`} onDrop={handleDrop} onDragOver={(e)=>{e.preventDefault()}}>
      <div className='flex justify-start items-center w-full gap-2 cursor-default'>
        <AiOutlineFolder className='text-stone-600 w-4 h-4'/>

      {/* <input value={folderName} minLength={1} className='outline-none'
      onChange={handleFolderNameInputChange}/>
       */}
      <div className='flex justify-start items-center w-full' 
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <div className='w-full'>
          {
          editingName ? 
          <input type="text" ref={myInputRef} spellCheck={false} className='bg-transparent outline-none w-full' maxLength={18} value={folderName} onChange={handleFolderNameInputChange}
          onKeyDown={handleInputKeyDown}/>
          :
          <div className='w-auto'>
            {folderName}
          </div>
          } 
        </div>
        <div className='flex justify-center items-center w-2/12'>
        {
        isHover ?
        <div className='flex w-full h-full justify-start gap-1 items-center'>
          <AiFillDelete className='text-red-600' onClick={handleDeleteClicked}/>
          <HiOutlinePencil className='text-stone-500' onClick={toggleEditingName}/>
        </div>
        : <></>
        }
        </div>
      </div>
      </div>
      {notes}
    </div>
  )
}

export default FolderComponent;