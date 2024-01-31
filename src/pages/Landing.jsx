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
        initial:{},
        animate: {
            x:0,
            //backgroundColor: "rgba(255,255,255,0)",
            //color:"#292524",
            transition:{type:"linear" , duration:0.25}

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
            <div id="nav" className="w-full h-10">
                
            </div>
            <div className="w-full text-center">
                <div className='w-1/2 mx-auto flex justify-between'>
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
                </div>
                <motion.div className='text-6xl align-center text-stone-800 mt-10 mb-2'>
                    <BsTextParagraph className='text-6xl inline-block'/>
                    <div className='inline-block font-[400] text-stone-800 transform translate-y-1'>
                        ONote
                    </div>
                </motion.div>
                <motion.span className='text-2xl font-light text-stone-800 text-center w-full'>
                    A fuss-free cloud solution for your note-taking woes
                </motion.span>
                
                <motion.div className="cursor-pointer w-fit h-fit text-md p-2.5 px-4 mt-5 mx-auto
                bg-stone-900 text-stone-50 rounded-md" variants={button} animate="animate" whileHover="whileHover"
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
