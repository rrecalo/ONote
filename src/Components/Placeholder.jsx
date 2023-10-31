import React from 'react'
import {motion} from 'framer-motion'

export const placeholderVariants = {
    initial:{
        //scaleX: 0,
        backgroundColor: 'rgb(214, 211, 209)',
    },
    animate:{
        //scaleX:1,
        backgroundColor: 'rgb(120, 113, 108)',
        transition:{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 2,
            //delay:stagger
        },
    },
}

const parent = {
    initial:{scaleX:0.5},
    animate:{
        scaleX:1,
        transition:{
            duration:0.25,
            staggerChildren: 0.5,
            delayChildren: 0,
        }
    }
}

const Placeholder = () => {
  return (
    <motion.div className='px-3 w-full h-auto mt-5 flex flex-col justify-center items-center gap-5'
    layout="position"
    variants={parent}
    initial="initial"
    animate="animate"
    >
    <motion.div variants={placeholderVariants} className='w-full h-3 bg-stone-600 rounded-full'></motion.div>
    <motion.div variants={placeholderVariants} className='w-full h-3 bg-stone-600 rounded-full'></motion.div>
    <motion.div variants={placeholderVariants} className='w-full h-3 bg-stone-600 rounded-full'></motion.div>
    <motion.div variants={placeholderVariants} className='w-full h-3 bg-stone-600 rounded-full'></motion.div>
    <motion.div variants={placeholderVariants} className='w-full h-3 bg-stone-600 rounded-full'></motion.div>
    </motion.div>
  )
}

export default Placeholder