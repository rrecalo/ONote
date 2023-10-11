import React from 'react'
import { AiFillDelete } from 'react-icons/ai'

const DeleteNoteButton = ({handleDeleteNote, disableDelete}) => {


  return (
    <button className={`text-lg hover:text-white px-2 py-2 rounded-md ${disableDelete ? 'hover:bg-stone-300' : 'hover:bg-red-500'}`} onClick={handleDeleteNote} disabled={disableDelete}>
        <AiFillDelete />
    </button>
  )
}

export default DeleteNoteButton