import React from 'react'
import './Messages.css'

const Message = ({children, user}) => {



  return (
    <div className={user=='ai' ? 'message ai-message' : 'message user-message'}>
        <p>{children}</p>
        <hr className="message-divider" />
    </div>
  )
}

export default Message