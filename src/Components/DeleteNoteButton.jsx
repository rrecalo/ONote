import React from 'react'
import { AiFillDelete } from 'react-icons/ai'

const DeleteNoteButton = ({handleDeleteNote, disableDelete}) => {


  return (
    <button className={`flex justify-center items-center text-xs w-full h-full rounded-md outline-none ${disableDelete ? '' : ''}`} onClick={handleDeleteNote} disabled={disableDelete}>
        <AiFillDelete />
    </button>
  )
}

export default DeleteNoteButton