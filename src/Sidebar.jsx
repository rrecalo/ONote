import React, {useEffect, useState} from 'react';
import {AiOutlineFileText, AiOutlinePlus} from 'react-icons/ai';
import PreferenceSelector from './PreferenceSelector';

const Sidebar = ({initializeNewNote, renderNoteList, newNoteCooldown, handlePref, pref, folders,...props}) => {

  const [isHoveringAdd, setIsHoveringAdd] = useState(false);
  const [confirmAdd, setConfirmAdd] = useState(false);
  const [folderCreation, setFolderCreation] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");
  
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
    if(!confirmAdd){
      setConfirmAdd(true);
    }
    else{
      initializeNewNote();
    }
  }

  function handleNewFolderClick(event){
    event.preventDefault();
    if(!folderCreation){
      setFolderCreation(true);
    }
    else 
      //initializeNewFolder();
      return;
  }

  return (
    <div id="sidebar" className='max-w-1/4 sm:max-w-1/4 lg:max-w-1/6 sm:min-w-[232px] h-full 
    bg-stone-50 flex flex-col justify-start items-center pt-10
    '>
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
          <div id="your-notes-section" className='flex flex-col justify-center items-start gap-1 mt-5 w-full'>
            <div className='flex flex-row items-center text-lg text-stone-800 text-left gap-1 pl-3'>
              <div>
                <AiOutlineFileText className='text-stone-600 w-4 h-4'/>
              </div>
              <div className='font-bold text-lg text-stone-600'>
                Notes
              </div>
            </div>
          {
            folders?.map(folder => 
              <div>
                {folder?.name}
              {renderNoteList(folder)}
              </div>
            )
  
          }
          {renderNoteList("")}
          </div>
          <div onClick={handleNewNoteClick} 
            onMouseEnter={() => setIsHoveringAdd(true)}
            onMouseLeave={() => {setIsHoveringAdd(false); setConfirmAdd(false)}}
            className={`flex h-[20%] w-[100%] justify-center items-start ${newNoteCooldown ? 'display-none' : ''}`}>
             {
              isHoveringAdd  && !newNoteCooldown  ? 
                <div className='w-full h-full'>
                  <div onClick={handleNewNoteClick} className='flex justify-center items-center bg-stone-100 w-full h-1/2'>
                    New Note
                  </div>
                  {folderCreation ?
                  <input className='' placeholder='Folder Name...' maxLength={24}/>
                  :
                  <div onClick={handleNewFolderClick} className='flex justify-center items-center bg-stone-100 w-full h-1/2'>
                    New Folder
                  </div>
                  }
                </div>
                : 
                <></>
            }
          </div>
        </div>
  )}

export default Sidebar