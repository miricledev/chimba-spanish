import React from 'react'
import { Link } from 'react-router-dom'

const InboxTab = ({children, user, selected, id, room, date, selectedInbox}) => {


    console.log(`Selected Inbox ${selectedInbox}`)
    console.log(room)
    return (

            

            <Link key={id} 
                style={{backgroundColor: selectedInbox == room ? '#e5e7eb' : ''}} 
                onClick={() => {
                    console.log(`Selected Inbox111 ${selectedInbox}`)
                    console.log(`room111 - ${room}`)

                    console.log(selectedInbox === room)
                }}
                className='flex flex-col p-3 justify-center items-center border-b-3 border-black w-50' 
                to={`/1/social/inbox/chats/${room}`}
            >
            
                <h2 className='font-carlito font-bold text-lg'>{user}</h2>

                <p>{children}</p>
            </Link>
            

        
    )
}

export default InboxTab