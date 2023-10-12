import React, {useEffect, useState} from 'react'
import {EditorWidth, EditorPosition } from './types/Preferences'

const PreferenceSelector = ({preferences, handlePreferenceChange}) => {

    const [fullWidth, setFullWidth] = useState(true);
    const [centered, setCentered] = useState(false);

    useEffect(()=>{
        handlePreferenceChange({
            editorWidth: fullWidth ? EditorWidth.full : EditorWidth.half,
            editorPosition: centered ? EditorPosition.center : EditorPosition.start
        })
    }, [fullWidth, centered]);


    function handleEditorWidthChange(){
        if(fullWidth){
            setFullWidth(false);
        }
        else{
            setFullWidth(true);
        }
    }

    function handleEditorPositionChange(){
        if(centered){
            setCentered(false);
        }
        else{
            setCentered(true);
        }
    }

  return (
    <div className='flex flex-col justify-center items-start'>
        <div className='flex justify-start items-center gap-1 text-stone-700 font-light'>
            <input type="checkbox" name="editorWidth" checked={fullWidth}
            onChange={handleEditorWidthChange} className='accent-stone-700 w-4 h-4 outline-none focus:outline-none bg-stone-400 border-none'/>
            <label>Full Editor Width</label>
        </div>
        { !fullWidth ? 
        <div className='flex justify-start items-center gap-1 text-stone-700 font-light'>
            <input type="checkbox" name="editorPosition" checked={centered}
            onChange={handleEditorPositionChange} className='accent-stone-700 w-4 h-4 outline-none focus:outline-none bg-stone-400 border-none'/>
            <label>Editor Centered</label>
        </div>
        : 
        <></>
        }
    </div>
  )
}

export default PreferenceSelector