import React from 'react'
import { Link } from 'react-router-dom'

const InboxTab = ({children, user, selected, id, room, date, selectedInbox}) => {


    console.log(selectedInbox)
    console.log(room)
    return (

            

            <Link key={id} 
                style={{backgroundColor: selectedInbox === room ? 'gray' : ''}} 
                className='flex flex-col p-3 justify-center items-center border-b-3 border-black w-50' 
                to={`/1/social/inbox/chats/${room}`}
            >
            
                <h2>{user}</h2>

                <p>{children}</p>
            </Link>
            

        
    )
}

export default InboxTab