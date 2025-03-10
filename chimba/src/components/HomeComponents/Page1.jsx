import React from 'react'

const Page1 = () => {
    const images = import.meta.glob("/src/assets/flags/*.{png,jpg,jpeg,svg}", { eager: true });

    const imageList = Object.values(images).map((image, index) => {
        return <img key={index} className='sm:w-30 sm:h-18 2xl:w-40 2xl:h-25' src={image.default} />
    })

    return(
        <div className='w-full h-screen bg-(--bg) scroll-snap-start'>
            <div className='flex flex-col items-center  justify-center gap-30 content-position '>
                <h2 className='font-koulen md:text-7xl 2xl:text-8xl'>Learn <span className='text-(--primary)'>any dialect</span> of Spanish now</h2>
                <div className='flex flex-row justify-around w-screen'>{imageList.slice(0, 5)}</div>
                <div className='flex flex-row justify-around w-screen'>
                    {imageList.slice(5, 7)}
                    <button className='btn-hover font-baloo2 text-white text-stroke-3 font-bold bg-(--primary) rounded-full w-100 text-5xl' onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth'})}>Discover more</button>
                    {imageList.slice(7, 9)}
                </div>
            </div>
        </div>
    )
}

export default Page1