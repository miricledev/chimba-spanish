import React from 'react'
import earth from '/src/assets/home/tr/earth.png'
import sa from '/src/assets/home/tr/sa.png'
import spain from '/src/assets/home/tr/spain.png'
import { FaArrowDown } from "react-icons/fa";

const Page5 = () => {
    return (
        <div className='w-full h-screen bg-(--bg2) relative scroll-snap-start'>
            <div className='flex flex-col justify-center gap-5 items-center content-position'>

                <div className='flex flex-row gap-8 justify-around items-center'>
                    <img className='w-70 h-70' src={earth} />
                    <img className='w-75 h-70' src={spain} />
                    <h2 className='italic font-medium font-inter text-center text-8xl'>
                        Travel Like a <span className='text-green-500'>Local</span>, <br /> Not a <span className='text-(--primary)'>Tourist</span>
                    </h2>
                </div>

                <div className='flex flex-row justify-center gap-15 items-center'>

                    <img className='w-85 h-90' src={sa} />

                    <div className='flex flex-col gap-15 justify-center align-center'>
                        <p className='text-center text-3xl font-medium'>
                            Master real-world Spanish for effortless travel. Learn how to: <br /><br />
                            Ask for directions like a native <br />
                            Order food and negotiate prices <br />
                            Handle taxis, buses, and metro systems <br />  
                            Blend in with local slang and customs
                        </p>
                        <button 
                            className='flex flex-row gap-3 btn btn-hover p-5 italic self-center text-black rounded-3xl font-medium font-inter text-4xl'
                            onClick={() => window.scrollTo({top: window.innerHeight * 5, behavior: 'smooth'})}
                        >
                            Not sure where to travel? <FaArrowDown />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Page5