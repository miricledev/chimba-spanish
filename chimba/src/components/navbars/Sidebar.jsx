import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const Sidebar = () => {

    const loc = useLocation()

    const nav = useNavigate()

    const toLogin = () => {
        return nav('/login')
    }

    const toReg = () => {
      return nav('/register')
    }

    const toHome = () => {
      return nav('/')
    }

    return (
        <div className='flex flex-row '>
            <div className='flex justify-start items-center gap-15 p-15 h-screen flex-col flex-start w-[25%] bg-(--primary)'>
                <h2 onClick={toHome} className='font-baloo2 sm:text-5xl 2xl:text-7xl p-7 text-white font-bold drop-shadow-sm btn-hover'>Chimba</h2>
                <div onClick={toLogin} className='p-2' style={loc.pathname === "/login" ? {border: '4px white solid', borderRadius: '10px'}: {}}>
                    <h3 className='cursor-pointer font-carlito text-4xl font-bold text-white text-stroke-3'>
                        Login
                    </h3>
                </div>
                <div onClick={toReg} className='p-2' style={loc.pathname === "/register" ? {border: '4px white solid', borderRadius: '10px'} : {}}>
                    <h3 className='cursor-pointer font-carlito text-4xl font-bold text-white text-stroke-3'>
                        Register
                    </h3>
                </div>
            </div>
            <Outlet />
        </div>

    )
}

export default Sidebar