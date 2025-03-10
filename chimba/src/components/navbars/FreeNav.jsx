import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { IoMdContact } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import { MdLogin } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { IconContext } from 'react-icons';

const FreeNav = () => {
  return (
    <div>
        <nav className='flex flex-row justify-between items-center h-100px fixed w-full z-50'>
            <h2 className='ml-10 font-baloo2 sm:text-5xl 2xl:text-7xl p-7 text-(--primary) font-bold drop-shadow-sm btn-hover' onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                Chimba
            </h2>
            <div className='flex flex-row justify-between p-10'>
                <button className='p-5 sm:text-xl 2xl:text-3xl btn-hover mix-blend-difference'>About</button>
                <button className='p-5 sm:text-xl 2xl:text-3xl btn-hover'>Contact</button>
                <button className='bg-(--primary) p-5 rounded-2xl sm:text-xl 2xl:text-3xl btn-hover'>Get started</button>
            </div>
        </nav>
        <Outlet />
    </div>
  )
}

export default FreeNav