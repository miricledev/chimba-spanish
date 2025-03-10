import React from 'react'

const CountryBio = ({country, subtitle, description, motive, buttonText, images, margin, infoSide, bgPhoto, bgText}) => {
    return (
        <div className='w-full h-screen bg-(--bg2) relative scroll-snap-start'>
            <div className='flex flex-row'>
                <div className='grid'>

                    {images}

                </div>
                <div className='flex flex-col justify-center gap-5 items-center'>

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