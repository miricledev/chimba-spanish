import React from 'react'
import './chats.css'
import { useAuth } from '../authorisation/AuthProvider'

const UserCard = ({user_id, firstName, lastName, image}) => {

    const { user } = useAuth()

    const getIDs = () => {
      const loggedInUserID = user.id
      const selectedUserID = user_id
    }

    return (
        <div className="user-card">
          {/* User Image (fallback if no image is provided) */}
          <div className="user-image-container">
            <img
              src={image || "https://via.placeholder.com/100"} // Default image
              alt={`${firstName} ${lastName}`}
              className="user-image"
            />
          </div>
    
          {/* User Name */}
          <h2 className="user-name">{firstName} {lastName}</h2>
    
          {/* Message Button */}
          <button className="message-button" onClick={getIDs}>Message</button>
        </div>
      );
}

export default UserCard