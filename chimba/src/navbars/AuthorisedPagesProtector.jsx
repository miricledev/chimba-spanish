import React, { useEffect } from 'react';
import { useAuth } from '../components/authorisation/AuthProvider';
import { Outlet, Link } from 'react-router-dom';
import { IoMail, IoMailUnreadSharp } from "react-icons/io5";
import { IconContext } from 'react-icons';
import { PiCoffeeDuotone } from "react-icons/pi";
import { GiBrain } from "react-icons/gi";
import { FaRobot } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { MdOutlinePersonSearch } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import Sideicon from './Sideicon';

const AuthorisedPagesProtector = () => {
    const { user, logout, redirectIfNotLoggedIn } = useAuth();

    useEffect(() => {
        console.log('User state on authorised page', user);
    }, []);

    useEffect(() => {
        redirectIfNotLoggedIn();
    }, [user]);

    return user ? (
        <div className="flex flex-row">
            {/* Sidebar */}
            <div className="fixed flex justify-start items-center sm:gap-2 2xl:gap-5 p-15 h-screen flex-col flex-start w-[100] bg-(--primary)">
                {/* Title */}
                <h2 className="font-baloo2 sm:text-5xl 2xl:text-7xl p-7 text-white font-bold drop-shadow-sm btn-hover">
                    Chimba
                </h2>

                <h3 className='text-lg '>Hello, <span className='font-bold'>{user.firstName} </span>👋</h3>

                <div className='flex flex-col items-start gap-1'>

                    <Sideicon Icon={PiCoffeeDuotone } link={'/1/'}>Feed</Sideicon>
                    <Sideicon Icon={GiBrain } link={'/1/learn'}>Learn</Sideicon>
                    <Sideicon Icon={FaRobot } link={'/1/aichat'}>AI Chat</Sideicon>
                    <Sideicon Icon={TiMessages } link={'/1/social'}>Social</Sideicon>
                    <Sideicon Icon={MdOutlinePersonSearch } link={'/1/findtutors'}>Find Tutor</Sideicon>
                    <Sideicon Icon={CgProfile } link={'/1/profile'}>Profile</Sideicon>
                </div>
        
                {/* Logout Button */}
                <button onClick={logout} className="navbar-button mt-5 text-white text-lg font-bold px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition">
                    Log Out
                </button>
            </div>
    
            {/* Page Content */}
            <div className='ml-100 p-10'><Outlet /></div>
        </div>

    ) : (
        <p className="redirect-message">Redirecting to login page...</p>
    );
};

export default AuthorisedPagesProtector;
