import React, {useState, useEffect} from 'react'
import { AiOutlineFileText, AiFillDelete } from 'react-icons/ai'
import {motion} from 'framer-motion'
import DeleteNoteButton from './DeleteNoteButton';

const NoteComponent = ({handleDragStart, handleReorderFolder, workingNote, note, openNote, handleDeleteNote, ...props}) => {

    const [isHover, setHover] = useState(false);

  return (

    <motion.div
        initial={{opacity:0, y:-5, backgroundColor: "#fafaf9"}}
        animate={{opacity:1, y:0, backgroundColor: "#fafaf9"}}
        whileHover={{backgroundColor: "#e7e5e4", x:0.5}}
        transition={{type:"tween", duration:0.3, ease:"linear"}}
        exit={{opacity:0, y:-5, backgroundColor: "#fafaf9", transition:{duration:0.15}}}
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
        draggable onDragStart={(e) => handleDragStart(e, note)} className={`flex flex-row justify-between items-center pl-3 w-full cursor-pointer text-sm
        t gap-1 pe-2 whitespace-nowrap + ${workingNote?._id === note._id ? 'text-stone-950' : 'bg-transparent text-stone-500'}`} 
        onClick={(e)=>{e.stopPropagation(); openNote(note?._id)}}
        onDrop={(e) =>handleReorderFolder(e, note)}
        onDragOver={(e)=>{e.preventDefault();}}
        key={note?._id}>
          <div className='flex justify-center items-center gap -1'>
            <AiOutlineFileText className={`w-4 h-4
            + ${workingNote?._id === note._id ? 'text-stone-950' : 'text-stone-600'}`} />
            <div className='text-sm'>
              {note?.title}
            </div>
          </div>
       
        <div className='flex justify-center items-center w-4 h-4'>
        {
        isHover ?
        <DeleteNoteButton handleDeleteNote={handleDeleteNote} />
        : <></>
        }
        </div>
        
        </motion.div>
  )
}

export default NoteComponent