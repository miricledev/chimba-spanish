import React, { useEffect } from 'react';
import { useAuth } from '../authorisation/AuthProvider';
import { Outlet, Link } from 'react-router-dom';
import { IoMail, IoMailUnreadSharp } from "react-icons/io5";
import { IconContext } from 'react-icons';

const AuthorisedPagesProtector = () => {
    const { user, logout, redirectIfNotLoggedIn } = useAuth();

    useEffect(() => {
        console.log('User state on authorised page', user);
    }, []);

    useEffect(() => {
        redirectIfNotLoggedIn();
    }, [user]);

    return user ? (
      <div className='page'>
          <div className="navbar-container">
                <nav className="navbar">
                
                    <div className="navbar-links">
                    
                        <Link to='/1/' className="navbar-link"> <img src='/chimba_logo.png' alt='loading' style={{width: '5rem', height: '5rem'}} /></Link>
                    </div>
                    <button onClick={logout} className="navbar-button">Log Out</button>
                    <Link to="inbox" className="">
                            <IconContext.Provider value={{size: '2rem'}}>
                                <IoMail />
                            </IconContext.Provider>
                    </Link>
                    
                </nav>
            </div>
            <div className='content'>
                <Outlet />
            </div>
      </div>

    ) : (
        <p className="redirect-message">Redirecting to login page...</p>
    );
};

export default AuthorisedPagesProtector;
