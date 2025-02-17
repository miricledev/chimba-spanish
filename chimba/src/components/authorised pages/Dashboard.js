import React from 'react';
import { useAuth } from '../authorisation/AuthProvider';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();

    return (
      <div className="dashboard-container">
          {/* Background Stripes */}
          <div className="background-stripes">
              <div className="stripe"></div>
              <div className="stripe"></div>
              <div className="stripe"></div>
              <div className="stripe"></div>
          </div>
  
          {/* Dashboard Card */}
          <div className="dashboard-card">
              <h1 className="dashboard-title">Dashboard</h1>
              <hr className="dashboard-divider" />
              <p className="dashboard-greeting">Hello, <span className="font-bold">{user.firstName}</span> 👋</p>
  
              <div className="dashboard-links">
                  <Link to="flashcards/" className="dashboard-link flashcards-link">Flashcards</Link>
                  <Link to="map/" className="dashboard-link map-link">Map</Link>
                  <Link to="aichat/" className="dashboard-link ai-chat-link">AI Chat</Link>
                  <Link to="readingcomp" className="dashboard-link reading-link">Reading</Link>
                  <Link to="findusers" className="">Users</Link>
              </div>
          </div>
      </div>
  );
  
};

export default Dashboard;
