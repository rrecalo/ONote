import React, { useRef, useEffect} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './TextEditor.css';
//import './mycontent.css';

export default function TextEditor({noteId, getNoteById, updateNoteContent, ...props}) {

  const editorRef = useRef(null);
  
  const log = () => {
    if (editorRef.current) {
    }
  };

  //when the note id changes, set the content to be equal to respective note id's content
  useEffect(()=>{
    if(noteId){
      editorRef.current.setContent(getWorkingNoteContent());
    }
  },[noteId])


  //save the editor content into parent's workingNote state
  function handleEditorChange(content, editor){
    updateNoteContent(noteId, content);
  }

  //fetch the text content of the current noteId
  function getWorkingNoteContent(){
    return getNoteById(noteId)?.text;
  }

  return (
    <div className='h-full overflow-hidden'>
      <Editor
        id="editor"
        onInit={(evt, editor) => editorRef.current = editor}
        onEditorChange={handleEditorChange}
        initialValue={getWorkingNoteContent}
        // value={note?.text}
        //"<p>This is the initial content of the editor. Some <b>more</b> <i>text</i> could also go in here...</p>"
        init={{
          height: 500,
          menubar: false,
          //min_height:
          plugins: [
            'advlist lists image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
          //content_style: 'body { font-family: Lato; font-size:14px; font-weight:200; }',
          content_css: "/mycontent.css",
          //background-color: #a8a29e;
          placeholder: "Type some text here...",
        }}
      />
      <button onClick={log}>Log editor content</button>
    </div>
  );
}
