import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, {modules, formats} from './EditorToolbar.jsx'
import 'react-quill/dist/quill.snow.css';
import {motion} from 'framer-motion'
import './TextEditor.css'

function TextEditor({noteId, getNoteById, updateNoteContent, setChangesPrompt, saveNoteContent, ...props}) {

  const [value, setValue] = useState(null);
  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [noteChanged, setNoteChanged] = useState(true);

  function StartTimer(){
    setChangesPrompt(1);
    updateNoteContent(noteId, value);

    const deleteTimer = setTimeout(()=>{
        //setSave(true);
        if(noteId && value !== undefined && value !== null){
        console.log("timer finished! changes saved");
        saveNoteContent(noteId);
        setChangesPrompt(0);
        }
        //3000
    }, 3000);
    setTimer(deleteTimer);
    //3
    setCountdown(3);
}

function CancelTimer(){
    if(timer){
        clearTimeout(timer);
    }
    setCountdown(0);
    setChangesPrompt(2);
}

useEffect(()=>{
    return () =>{
        if(timer){
            clearTimeout(timer);
        }
    }
}, [timer, noteId])

useEffect(()=>{
    if(countdown > 0){
        const countTimer = setTimeout(()=>{
            setCountdown(val => val -1);
        }, 1000);
        return () => clearInterval(countTimer);
    }
}, [countdown])

  const handleChange = newValue => {
    setValue(newValue);
  };

  useEffect(()=>{
    if(value !== null && value !== undefined && !noteChanged){
      StartTimer(3);
      
      //updateNoteContent(noteId, value);
    }
    setNoteChanged(false);
  },[value])

  useEffect(()=>{
    CancelTimer();
    if(noteId){
      setValue(getNoteById(noteId)?.text);
      setNoteChanged(true);
    }
    
  }, [noteId])

  return (
    <motion.div className="text-editor"
    layout="position"
    initial={{opacity:0, y:-10}}
    animate={{opacity:1, y:0}}
    transition={{duration:0.35}}>
      <EditorToolbar />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={"Write something awesome..."}
        modules={modules}
        formats={formats}
      />
    </motion.div>
  );
}
export default TextEditor;