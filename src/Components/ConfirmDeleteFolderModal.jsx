import React, {useEffect, useState} from 'react'
import { AiFillDelete } from 'react-icons/ai'
import {motion} from 'framer-motion'
const ConfirmDeleteFolderModal = ({showModal, closeModal, deleteFolder, folder}) => {

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [timer, setTimer] = useState(null);
    const [countdown, setCountdown] = useState(0);


    function handleDeleteButtonClicked(){
        if(confirmDelete) 
        {
            if(folder){
            deleteFolder(folder);
            setConfirmDelete(false);
            }
            return;
        }

    }

    function StartTimer(){
        const deleteTimer = setTimeout(()=>{
            setConfirmDelete(true);
            //3000
        }, 100);
        setTimer(deleteTimer);
        //3
        setCountdown(0);
    }

    function CancelTimer(){
        if(timer){
            clearTimeout(timer);
        }
        setCountdown(0);
        setConfirmDelete(false);
    }

    useEffect(()=>{
        return () =>{
            if(timer){
                clearTimeout(timer);
            }
        }
    }, [timer])

    useEffect(()=>{
        if(countdown > 0){
            const countTimer = setTimeout(()=>{
                setCountdown(val => val -1);
            }, 1000);
            return () => clearInterval(countTimer);
        }
    }, [countdown])


  return (
    showModal ?
    <div id="confirm-delete-modal"  className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20">
      <motion.div className="modal-overlay bg-stone-500 opacity-50 w-full h-full absolute" onClick={closeModal} 
      initial={{opacity:0}}
      animate={{opacity:0.5}}/>
      <motion.div className="modal-container w-11/12 md:max-w-sm mx-auto rounded-lg shadow-lg z-50 overflow-y-auto"
      initial={{opacity:0, scale:0.5}}
      animate={{opacity:1, scale:1}}
      transition={{duration:0.25}}>
        <div className="modal-content py-2 text-left px-3 bg-stone-100 h-44 opacity-100">
          <div className='flex flex-col h-full justify-around text-center'>
            <div>
            <div className='font-bold'>Are you sure you want to delete this Folder?</div>
            <div className='font-light text-stone-800 text-xs italic mt-1'>This also deletes ALL of its contents, and cannot be undone</div>
            </div>
            <div>{folder?.name}</div>
           
                
            <div className='flex flex-row justify-center gap-10 items-center mt-1'>
                <button onClick={closeModal} 
                className='bg-stone-50 hover:bg-stone-100 border border-stone-500 font-semibold px-4 py-2 outline-none rounded-lg'>Cancel</button>
                <button onMouseEnter={StartTimer} onMouseLeave={CancelTimer} onClick={handleDeleteButtonClicked} 
                className='w-28 flex gap-2 justify-center items-center bg-red-600 hover:bg-red-500 text-stone-50 font-semibold px-3 py-2 outline-none rounded-lg'>
                    
                    {
                        countdown > 0 ? 
                        <>{countdown}</>:
                        
                        confirmDelete ? <>
                        <AiFillDelete className='w-4 h-4'/>
                            Delete
                        </>
                        : 
                        <>Confirm</>
                    }
                </button>
            </div>
          
          
          </div>
        </div>
      </motion.div>
    </div>
    :
    <></>
  )
}

export default ConfirmDeleteFolderModal