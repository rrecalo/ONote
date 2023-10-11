import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './TextEditor.css';
//import './mycontent.css';

export default function TextEditor({note, ...props}) {

  const editorRef = useRef(null);
  
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  function handleEditorChange(content){
    console.log(content);
  }

  return (
    <div className='h-full overflow-hidden'>
      <Editor
        id="editor"
        onInit={(evt, editor) => editorRef.current = editor}
        onEditorChange={handleEditorChange}
        initialValue={note?.text}
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
          content_css: "/mycontent.css"
          //background-color: #a8a29e;
        }}
      />
      <button onClick={log}>Log editor content</button>
    </div>
  );
}
