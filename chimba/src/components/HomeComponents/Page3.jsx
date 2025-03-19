import React from 'react'
import image from '/src/assets/home/robot.png'

const Page3 = () => {
    return (
        <div className='w-full h-screen bg-black relative scroll-snap-start'>
            <div className='flex flex-row justify-center gap-20 items-center content-position'>
                <img src={image} className='w-140 h-140' />
                <div className='flex flex-col gap-20 justify-center align-center'>
                    <h2 className='text-(--bg) text-6xl text-center italic font-medium'>
                        Chat 1-on-1 with <span className='text-green-500'>AI</span> <br /> <span className='text-(--primary)'>Specialized</span> in your dialect
                    </h2>
                    <p className='text-(--bg) font-medium text-center sm:text-2xl 2xl:text-3xl'>
                        Need instant practice?
                        <br /><br />
                        Our AI understands and responds <br /> naturally in your chosen Spanish dialect. 
                        <br /><br />
                        Have a casual chat, test your slang, or <br /> refine your grammar <span className='italic text-pink-500'> anytime, anywhere</span>.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page3