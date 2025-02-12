import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Outlet, Link } from 'react-router-dom';
import './Auth.css';

const AuthorisedPagesProtector = () => {
    const { user, logout, redirectIfNotLoggedIn } = useAuth();

    useEffect(() => {
        console.log('User state on authorised page', user);
    }, []);

    useEffect(() => {
        redirectIfNotLoggedIn();
    }, [user]);

    return user ? (
      <div>
          <div className="navbar-container">
            <nav className="navbar">
                <div className="navbar-links">
                    <Link to='/1/' className="navbar-link">Dashboard</Link>
                </div>
                <button onClick={logout} className="navbar-button">Log Out</button>
            </nav>
        </div>
        <Outlet />
      </div>

    ) : (
        <p className="redirect-message">Redirecting to login page...</p>
    );
};

export default AuthorisedPagesProtector;
