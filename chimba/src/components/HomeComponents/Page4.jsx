import React from 'react'

const Page4 = () => {

    const images = import.meta.glob("/src/assets/home/rw/*.{png,jpg,jpeg,svg}", { eager: true });

    const orderMap = { 3: 1, 0: 3, 1: 0 };

    const imageList = Object.values(images).map((image, index) => {
        return <img key={index} className='sm:w-30 sm:h-30 2xl:w-50 2xl:h-50' style={{ order: orderMap[index] ?? index }} src={image.default} />
    })

    return (
        <div className='w-full h-screen bg-(--bg) relative scroll-snap-start'>
            <div className='flex flex-col justify-center gap-20 items-center content-position'>
                <div className='flex flex-row justify-center gap-15 items-center'>
                    <div className='flex flex-col justify-center items-center gap-10'>
                        <h2 className='2xl: text-7xl text-center italic font-inter'>
                            Real-World <span className='text-(--primary)'>Learning</span>, <br /> Read-World <span className='text-(--primary)'>Skills</span>
                        </h2>
                        <h3 className='font-inter 2xl:text-5xl text-center font-light'>
                            Learn Spanish the way it's actually <br /> spoken.
                        </h3>
                        <button className='btn btn-hover text-stroke-3 w-100 p-5'>
                            Sign up now
                        </button>
                    </div>
                    <div className='grid grid-cols-2 grid-rows-2 gap-5'>
                        {imageList}
                    </div>
                </div>
                <p className='font-inter 2xl:text-4xl'>
                    <span className='text-(--primary) text-stroke-3'>Chimba</span> gives 
                    you <span className='font-extrabold'>unfiltered</span> access to <span className='italic font-bold'>real world materials</span>
                </p>
            </div>
        </div>
    )
}

export default Page4