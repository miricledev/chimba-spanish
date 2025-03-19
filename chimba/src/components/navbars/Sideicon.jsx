import React from 'react'
import { Link, useLocation, useResolvedPath } from 'react-router-dom'

const Sideicon = ({children, link, Icon, customStyle}) => {

    const loc = useLocation()

    const res = useResolvedPath(link)

    const cn = customStyle !== undefined ? '' : 'flex flex-row items-center justify-center gap-3 p-3 text-white text-3xl text-stroke-3 font-carlito'

    const cs = customStyle || [{}, {}]

    const isActive = loc.pathname.split('/').filter(Boolean).pop() === link || loc.pathname === res.pathname;

    console.log(loc.pathname)

    return (
        <div>
            <Link 
                className={cn}
                style={{
                    ...(isActive
                      ? { border: '4px white solid', borderRadius: '10px', ...cs[1] } // Explicitly apply border when active
                      : { ...cs[0] }
                    ),
                  }}
                to={link}
            >
                {Icon && <Icon className='text-white text-3xl text-stroke-3' />} {children}
            </Link>
        </div>
    )
}

export default Sideicon