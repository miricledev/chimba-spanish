import React from 'react'
import { useParams } from 'react-router-dom'
import './chats.css'

const ChatInterface = () => {

    const bothIDs = useParams()
    const userID = bothIDs.id1
    const connectedUserID = bothIDs.id2


  return (
    <div className='chat-int'>
        ChatInterface
        {userID}
        {connectedUserID}
        <div className='message-container'>

        </div>

        <div className='message-input'>

            <input type='text' placeholder='Enter message here' />

        </div>
    </div>
  )
}

export default ChatInterface