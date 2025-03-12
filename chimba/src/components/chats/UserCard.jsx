import React from 'react'
import { useAuth } from '../authorisation/AuthProvider'
import { useNavigate } from 'react-router-dom'

const UserCard = ({k, user_id, firstName, lastName, image}) => {

    const { user } = useAuth()

    const navigator = useNavigate()

    const getIDs = () => {
        const loggedInUserID = user.id
        const selectedUserID = user_id

        const sortedIDs = [loggedInUserID, selectedUserID].sort((a, b) => a-b).join("/")

        return navigator(`/1/chats/${sortedIDs}`)
    }

    return (
        <div key={k} className="user-card">
          {/* User Image (fallback if no image is provided) */}
          <div className="user-image-container">
            <img
              src={image} // Default image
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