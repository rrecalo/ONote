import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ReactQuill from 'react-quill';
import EditorToolbar, {modules, formats} from './EditorToolbar.jsx'
import 'react-quill/dist/quill.snow.css';
import {motion, AnimatePresence} from 'framer-motion'
import './TextEditor.css'
import Placeholder from './Placeholder.jsx';

function TextEditor({noteId, getNoteById, updateNoteContent, setChangesPrompt, saveNoteContent, ...props}) {

  const {user} = useAuth0();
  const [value, setValue] = useState(null);
  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [noteChanged, setNoteChanged] = useState(true);
  const [loading, setLoading] = useState(true);
  //const [noteChanged, setNoteChanged] = useState(true);

  useEffect(()=>{
   
  }, []);

  useEffect(()=>{
    if(noteId){
      const loadingTimeout = setTimeout(()=>{
        setLoading(false);
        const source = new EventSource('http://localhost:3001/collaborate/'+noteId);
        source.onmessage = function (event){
            console.log('Received SSE:', event.data);
            setValue(event.data);
        }
      }, 500);
      return ()=>{clearInterval(loadingTimeout);}
    }
    else{
      setLoading(true);
    }
  }, [noteId])


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
    if(!noteChanged){
    if(value !== null && value !== undefined){
      StartTimer(3);
      
      //updateNoteContent(noteId, value);
    }
    }
      else setNoteChanged(false)

  },[value])

  useEffect(()=>{
    
    setNoteChanged(true);
    CancelTimer();
    if(noteId){
      setValue(getNoteById(noteId)?.text || "");
    }
    
  }, [noteId])



  return (
    <motion.div className="text-editor"
    layout="position"
    initial={{opacity:0, y:-10}}
    animate={{opacity:1, y:0}}
    transition={{duration:0.35}}>
      <AnimatePresence mode='wait'>
      {/* animate={{opacity:[1, 1], x:[0, 25, 0], transition:{repeat:Infinity, repeatType:"reverse", repeatDelay:2, duration:0.5}}} */}
      {
      loading  && user?
      <>
        <motion.div
          className='font-light text-stone-600 pl-5'
          initial={{opacity:0, x:0}}
          animate={{opacity:1, x:25, transition:{repeat:Infinity, repeatType:"loop", repeatDelay:5, duration:1, delay:2}}}>
            You've got no notes - make one using the sidebar
        </motion.div>
      </>
      :
        noteId? 
        <>
        <EditorToolbar key="editor_toolbar"/>
        <ReactQuill
          key="quill_editor"
          theme="snow"
          value={value}
          onChange={handleChange}
          placeholder={"Write something awesome..."}
          modules={modules}
          formats={formats}
        />
        </>
        :
        <Placeholder />
      }
      </AnimatePresence>
    </motion.div>
  );
}
export default TextEditor;
