import { motion } from 'framer-motion'
import './Landing.css'
import { BsTextParagraph } from "react-icons/bs";
import { MdOutlineArrowForward } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Landing(){

    const navigate = useNavigate();

    function handleCallToActionClick(){
        navigate("/login");    
    }

    const button = {
        initial:{x:-10},
        animate: {
            x:0,
            //backgroundColor: "rgba(255,255,255,0)",
            //color:"#292524",
            transition:{type:"linear" , duration:0.5}

        },
        whileHover: {
            x:10,
            //backgroundColor: "#44403c",
            //color: "#e7e5e4",
            transition:{type:"linear" , duration:0.25}
        },
    }

    return (
    <div className='w-full h-full min-h-[100vh] m-0 p-0 bg-stone-50'>
        <div className="w-full sm:w-3/4 mx-auto">
            <div className="w-full text-center mt-10">
                <motion.div className='w-5/6 sm:w-1/2 mx-auto flex justify-between'
                initial={{opacity:0, y:-3}} animate={{opacity:1, y:0}} transition={{delay:1, duration:0.5}}>
                    <motion.a target="_blank" href="https://github.com/rrecalo/ONote"
                    className='text-md p-3 rounded-lg block w-fit text-stone-700'
                    animate={{y:0}} whileHover={{y:-3}}>
                        <div className='inline-block pe-1 font-normal'>
                            view on github
                        </div>
                        {/*<MdOutlineArrowForward className='inline-block'/>*/}
                    </motion.a>
                    <motion.a target="_blank" href="https://www.robertrecalo.com"
                    className='text-md p-3 rounded-lg block w-fit text-stone-700'
                    animate={{y:0}} whileHover={{y:-3}}>
                        <div className='inline-block pe-1 font-normal'>
                            my portfolio
                        </div>
                        {/*<MdOutlineArrowForward className='inline-block'/>*/}
                    </motion.a>
                </motion.div>
                <motion.div className='text-6xl align-center text-stone-800 mt-20 sm:mt-10 mb-2'
                initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.25}}        
                >
                    <BsTextParagraph className='text-6xl inline-block'/>
                    <div className='inline-block font-[400] text-stone-800 transform translate-y-1'>
                        ONote
                    </div>
                </motion.div>
                <motion.span className='block w-3/4 mx-auto text-lg sm:text-2xl font-light text-stone-800 text-center w-full'
                initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}>
                    A fuss-free cloud solution for your note-taking woes
                </motion.span>
                
                <motion.div className="cursor-pointer text-lg sm:text-xl w-1/2 sm:w-fit sm:h-fit text-md p-2.5 px-4 mt-10 mx-auto
                bg-stone-900 text-stone-50 rounded-md" variants={button} initial="initial" animate="animate" whileHover="whileHover"
                onClick={handleCallToActionClick}>  
                    Get Started
                    <MdOutlineArrowForward className='ml-2 inline-block'/>
                </motion.div>
            </div>
        </div>
    </div>
    )
}

export default Landing;
