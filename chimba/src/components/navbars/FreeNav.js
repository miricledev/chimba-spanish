import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import './freeNav.css'
import { IoMdContact } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import { MdLogin } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { IconContext } from 'react-icons';

const FreeNav = () => {
  return (
    <>
        <nav className='main-container'>
            <IconContext.Provider value={{style: {fontSize: '30px;'}}}>
                <div className='side'>
                    <Link className='link' to='/' ><FaHome /></Link>
                    <Link className='link'>About Us</Link>
                    <Link className='link'>Contact Us <IoMdContact /></Link>
                    <Link className='link'>Support <MdContactSupport /></Link>
                </div>
                <div className='side'>
                    <Link className='link' to='register'>Register <IoAddCircle /></Link>
                    <Link className='link' to='login'>Login <MdLogin /></Link>
                </div>
            </IconContext.Provider>
        </nav>
        <Outlet />
    </>
  )
}

export default FreeNav