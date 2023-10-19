import React, {useEffect, useState, useRef } from 'react'
import {EditorWidth, EditorPosition } from '../types/Preferences'
import {AnimatePresence, motion} from 'framer-motion'
import {HiEllipsisHorizontal} from 'react-icons/hi2'

const PreferenceSelector = ({preferences, handlePreferenceChange}) => {

    const [fullWidth, setFullWidth] = useState(true);
    const [centered, setCentered] = useState(false);
    const [open, setOpen] = useState(false);
    const modalRef = useRef(null);

    useEffect(()=>{
        handlePreferenceChange({
            editorWidth: fullWidth ? EditorWidth.full : EditorWidth.half,
            editorPosition: centered ? EditorPosition.center : EditorPosition.start
        })
    }, [fullWidth, centered]);


    useEffect(()=>{
        if(open){
            document.addEventListener('click', handleOutsideClick);
        }
    }, [open])

    function handleOutsideClick(e){        
        if(modalRef.current && !modalRef.current.contains(e.target))
            setOpen(false);
    }

    function handleEditorWidthChange(){
        if(fullWidth){
            setFullWidth(false);
            setCentered(true);
        }
        else{
            setFullWidth(true);
            setCentered(false);
        }
    }

    // function handleEditorPositionChange(){
    //     if(centered){
    //         setCentered(false);
    //     }
    //     else{
    //         setCentered(true);
    //     }
    // }
    
    function handleMenuToggle(){
        if(open){
            setOpen(false);
        }
        else{
            setOpen(true);
        }
    }

  return (
    <motion.div ref={modalRef} className='absolute top-5 right-10 w-8 h-8' layout="position">
        <motion.div className='rounded-md' 
        animate={{backgroundColor: "transparent"}}
        whileHover={{backgroundColor: "#d6d3d1"}}>
        <HiEllipsisHorizontal className='flex justify-center items-center w-full h-full text-stone-600' onClick={handleMenuToggle} />
        </motion.div>
        {
            open ?
            
        <motion.div  className="absolute right-0 z-50 mt-0 h-auto w-40 origin-top-right rounded-md bg-stone-50 shadow-lg ring-2 ring-black ring-opacity-5 focus:outline-none
        flex flex-col justify-start items-center p-2"
        layout="position"
        initial={{scaleY: 0.75, scaleX:0.75, y:0, opacity:0}}
        animate={{scaleY: 1, scaleX:1, y:0, opacity:1}}
        transition={{duration:0.25}}>
            <div className='flex gap-2 p-1'>
            <label className='text-stone-600 font-light'>Full Width</label>
            <motion.span class="border rounded-full border-grey flex items-center cursor-pointer w-11 h-6 justify-start "
            onClick={handleEditorWidthChange}
            initial={{background: fullWidth ? "#a8a29e" : ""}}
            animate={{background: fullWidth ? "#a8a29e" : ""}}
            transition={{delay:0.15, duration:0}}
            layout="preserve-aspect"
            >

                <motion.span class="rounded-full border w-5 h-5 border-grey bg-white shadow" 
                initial={{x: fullWidth ? "100%" : "0%"}}
                animate={{x: fullWidth ? "100%" : "0%"}}
                transition={{duration:0.15, ease:"linear"}}/>
            </motion.span>
            </div>
        </motion.div>
        : <></>
        }
    </motion.div>
  )
}

export default PreferenceSelector