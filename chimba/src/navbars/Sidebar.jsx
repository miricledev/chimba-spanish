import React from 'react'
import { Outlet } from 'react-router-dom'
import Sideicon from './Sideicon'
import { TbLogin2 } from "react-icons/tb";

const Sidebar = () => {

    return (
        <div className='flex flex-row '>
            <div className='flex justify-start items-center md:gap-5 2xl:gap-15 p-15 h-screen flex-col flex-start w-[25%] bg-(--primary)'>
                <h2 className='font-baloo2 sm:text-5xl 2xl:text-7xl p-7 text-white font-bold drop-shadow-sm btn-hover'>Chimba</h2>
                <Sideicon link='/login'>Login</Sideicon>
                <Sideicon link='/register'>Register</Sideicon>
            </div>
            <Outlet />
        </div>

    )
}

export default Sidebar