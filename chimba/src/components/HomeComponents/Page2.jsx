import React, { useState } from 'react'
import meeting from '/src/assets/home/meeting.png'
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";

const Page2 = () => {

    const [phase, setPhase] = useState(0)

    return (
        <div className='w-full h-screen bg-(--bg2) relative scroll-snap-start'>
            <div className='flex flex-col items-center justify-center gap-5 content-position'>
                <div className='flex flex-row gap-20'>
                    <div className='flex flex-col justify-center sm:gap-6 2xl:gap-12'>
                        <h2 className='italic font-medium sm:text-6xl 2xl:text-8xl font-inter text-center'>
                            Learn, Practice,<br /> and <span className='text-(--primary)'>Connect</span>
                        </h2>
                        <p className='italic text-center font-normal sm:text-xl 2xl:text-3xl'>
                            Learning is better together! Meet and interact with <br /> other students in our virtual community. <br /> 
                            <span className='not-italic font-extrabold'>¡Qué chimba!</span>
                        </p>
                    </div>
                    <img src={meeting} className='sm:w-80 sm:h-60 2xl:w-120 2xl:h-100' />
                </div>
                <div className=' flex flex-row justify-center gap-20 w-[70%] items-center'>
                    <div className='max-w-250 bg-(--bg) p-12 rounded-4xl font-inter text-center sm:text-2xl 2xl:text-4xl'>
                        Practice conversations, join live study groups, 
                        and <span className='font-extrabold'>immerse yourself</span> in real-world Spanish. 
                        Whether you're preparing for travel or just want to chat 
                        with <span className='font-bold'>like-minded</span> learners, <span className='italic font-bold'>this is the place to do it.</span>
                    </div>
                    <div className='p-10 bg-(--primary) w-35 h-35 rounded-[50%] flex items-center justify-center btn-hover' onClick={() => window.scrollTo({top: window.innerHeight*2, behavior: 'smooth'})}>
                        <p className='font-baloo2 text-6xl font-bold text-white text-stroke-3'>
                            AI?
                        </p>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Page2