import React, {useEffect, useState, useRef } from 'react'
import {EditorWidth, EditorPosition } from '../types/Preferences'
import {AnimatePresence, motion} from 'framer-motion'
import {HiEllipsisHorizontal} from 'react-icons/hi2'
import {BiLogOut} from 'react-icons/bi'
import { useAuth0 } from '@auth0/auth0-react'

const SettingsMenu = ({preferences, handlePreferenceChange}) => {

    const [fullWidth, setFullWidth] = useState();
    const [centered, setCentered] = useState();
    const [open, setOpen] = useState(false);
    const modalRef = useRef(null);
    const { user, logout } = useAuth0();

    useEffect(()=>{
        if(preferences?.editorWidth){
            setFullWidth(preferences?.editorWidth === "full" ? true : false);
            setCentered(preferences?.editorWidth === "full" ? true : false);
        }
    }, [preferences])

    useEffect(()=>{
        if(fullWidth !== undefined && fullWidth !== null){
        handlePreferenceChange({
            editorWidth: fullWidth ? "full" : "half",
            editorPosition: "center"
        });
        }
    }, [fullWidth]);


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
    
    function handleMenuToggle(){
        if(open){
            setOpen(false);
        }
        else{
            setOpen(true);
        }
    }


  return (
    <motion.div ref={modalRef} className='absolute top-10 right-10 w-8 h-8' layout="position">
        <motion.div className='rounded-md' 
        animate={{backgroundColor: "rgb(255, 255, 255)"}}
        whileHover={{backgroundColor: "rgb(214, 211, 209)"}}
        transition={{duration:0.15}}>
        <HiEllipsisHorizontal className='flex justify-center items-center w-full h-full text-stone-600' onClick={handleMenuToggle} />
        </motion.div>
        {
            open ?
            
        <motion.div className="absolute right-0 z-50 mt-1 h-auto w-44 origin-top-right rounded-md bg-stone-50 shadow-lg ring-2 ring-black ring-opacity-5 focus:outline-none
        flex flex-col justify-start items-center p-2 pl-3"
        layout="position"
        initial={{scaleY: 0.75, scaleX:0.75, y:0, opacity:0}}
        animate={{scaleY: 1, scaleX:1, y:0, opacity:1}}
        transition={{duration:0.25}}>
            <div className='flex flex-col w-full justify-start items-start text-left mb-2'>
                <div className='italic text-stone-600 text-xs'>
                    Logged In
                </div>
                <div className='text-900 w-full break-all'>
                    {user.name}
                </div>
            </div>
            <div className='flex flex-col justify-center items-center'>
            <div className='flex gap-2 mt-2 mb-2 w-full'>
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
            <motion.div className='flex w-fit justify-center items-center gap-1 mt-5 mb-1 rounded-xl px-3 py-1' 
            animate={{color:'rgb(120, 113, 108)', backgroundColor:'transparent'}} whileHover={{color:'rgb(68, 64, 60)', backgroundColor:'rgb(231, 229, 228)'}}
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log Out <BiLogOut className='w-5 h-5'/> 
            </motion.div>
            </div>
        </motion.div>
        : <></>
        }
    </motion.div>
  )
}

export default SettingsMenu