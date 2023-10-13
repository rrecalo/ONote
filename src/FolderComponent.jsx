import React from 'react'


const FolderComponent = ({folder, notes, ...props}) => {
  return (
    <div className={`text-stone-600 pl-3 w-full cursor-pointer
    t gap-1 pe-2 mt-1`}>
      {folder?.name}
      {notes}
    </div>
  )
}

export default FolderComponent;