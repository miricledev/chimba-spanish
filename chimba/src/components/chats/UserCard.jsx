import React from 'react'
import { useAuth } from '../authorisation/AuthProvider'
import { useNavigate } from 'react-router-dom'
import pfp from '/src/assets/pfp.png'

const UserCard = ({k, user_id, firstName, lastName, image}) => {

    const { user } = useAuth()

    const navigator = useNavigate()

    const getIDs = () => {
        const loggedInUserID = user.id
        const selectedUserID = user_id

        const sortedIDs = [loggedInUserID, selectedUserID].sort((a, b) => a-b).join("/")

        return navigator(`chats/${sortedIDs}`)
    }

    return (
        <div key={k} className="flex flex-col p-6 border-3 gap-5 rounded-2xl border-black">
          {/* User Image (fallback if no image is provided) */}
          <div className="flex flex-row gap-5 justify-start items-center">
            <img
              src={pfp} // Default image
              alt={pfp}
              className=" sm:w-10 sm:h-10 2xl:w-15 2xl:h-15"
            />
            
            <div className='flex flex-col justify-center align-center'>
              <h2 className="font-carlito sm:text-2xl  2xl:text-3xl font-medium">{firstName} {lastName}</h2>
              <h3>320XP</h3>
            </div>
            
          </div>
    
          <h3>Learning Spanish</h3>
    
          {/* Message Button */}
          <button className="btn-hover btn font-carlito text-stroke-3 sm:text-2xl 2xl:text-3xl flex flex-row items-center justify-center p-3 sm:w-45 2xl:w-70 border border-gray-300 rounded-xl" onClick={getIDs}>Send message</button>
        </div>
      );
}

export default UserCard