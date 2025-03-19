import React from 'react'
import { Link } from 'react-router-dom'

const InboxTab = ({children, user, selected, id, room, date}) => {
    return (

        <div key={id} className='flex flex-col p-3 justify-center items-center border border-black w-50' >

            <Link to={`/1/social/inbox/chats/${room}`}>
            
                <h2>{user}</h2>

                <p>{children}</p>
            </Link>
            

        </div>
    )
}

export default InboxTab