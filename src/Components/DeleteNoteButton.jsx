import React from 'react'
import { AiFillDelete } from 'react-icons/ai'

const DeleteNoteButton = ({handleDeleteNote, disableDelete}) => {


  return (
    <button className={`text-xs rounded-md outline-none ${disableDelete ? '' : ''}`} onClick={handleDeleteNote} disabled={disableDelete}>
        <AiFillDelete />
    </button>
  )
}

export default DeleteNoteButton