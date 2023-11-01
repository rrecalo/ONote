import React from 'react'
import {motion} from 'framer-motion'

const EmptyListPlaceholder = () => {
  return (
    <motion.div className='flex flex-row justify-between items-center pl-3 w-full text-sm text-stone-700 italic gap-1 pe-2'
    initial={{
        x:-5,
        opacity:0,
    }}
    animate={{
        x:0,
        opacity:1
    }}
    exit={{
        x:10,
        opacity:0
    }}
    >
        Hover here to make a note!
    </motion.div>
  )
}

export default EmptyListPlaceholder