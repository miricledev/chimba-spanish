import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sideicon = ({children, link, Icon}) => {

    const loc = useLocation()

    return (
        <div>
            <Link 
                className='flex flex-row items-center justify-center gap-3 p-3 text-white text-3xl text-stroke-3 font-carlito'
                style={loc.pathname === link ? {border: '4px white solid', borderRadius: '10px'} : {}} 
                to={link}
            >
                <Icon className='text-white text-3xl text-stroke-3' /> {children}
            </Link>
        </div>
    )
}

export default Sideicon