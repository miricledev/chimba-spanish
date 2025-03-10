import React from 'react'

const CountryBio = ({country, subtitle, description, motive, buttonText, images, margin, infoSide, bgPhoto, bgText}) => {
    return (
        <div className='w-full z-60 h-screen bg-(--bg2) relative scroll-snap-start flex justify-center items-center'>
            <div className='flex flex-row justify-center w-screen items-center' style={infoSide=="left" ? {flexDirection: "row-reverse"} : {}}>
                <div className='grid grid-cols-2 h-screen w-full' style={{backgroundColor: bgPhoto}}>

                    {images}

                </div>
                <div className='h-screen flex flex-col justify-center gap-5 w-full items-center' style={{backgroundColor: bgText, width: `${margin}%`}}>

                    <h2 className='font-euphoria text-9xl'>{country}</h2>

                    <h3 className='font-inter font-bold italic text-3xl text-center'>{subtitle}</h3>

                    <p className='font-light font-inter italic text-center text-xl'>{description}</p>

                    <h3 className='font-medium font-inter italic text-2xl text-center'>{motive}</h3>

                    <button className='btn btn-hover text-black font-inter italic text-xl p-5'>{buttonText}</button>

                </div>
            </div>
        </div>
    )
}

export default CountryBio