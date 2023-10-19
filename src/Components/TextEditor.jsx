import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, {modules, formats} from './EditorToolbar.jsx'
import 'react-quill/dist/quill.snow.css';
import {motion} from 'framer-motion'
import './TextEditor.css'

function TextEditor({noteId, getNoteById, updateNoteContent, ...props}) {

  const [value, setValue] = useState(null);
  const handleChange = newValue => {
    setValue(newValue);
  };

  useEffect(()=>{
    if(value !== null && value !== undefined){
      console.log(value);
      updateNoteContent(noteId, value);
    }
  },[value])

  useEffect(()=>{
    if(noteId){
      setValue(getNoteById(noteId)?.text);
    }
  }, [noteId, getNoteById])

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