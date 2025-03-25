import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ChatInterface from './ChatInterface'
import { useAuth } from '../authorisation/AuthProvider'
import InboxTab from './InboxTab'

const Inbox = () => {

  const [inbox, setInbox] = useState([])

  const [selectedInbox, setSelectedInbox] = useState('')

  const { user } = useAuth()

  useEffect(() => {
    axios.post('/api/get-inbox', {id: user.id}).then(
        res => {
          console.log(Object.values(res.data))
          setInbox(Object.values(res.data).map(i => {
            return {
              id: i[0],
              room: i[1],
              user: `User ${i[3]}`,
              message: i[4],
            }
          }));
          
      }
    )
  }, [])



  return (
    <div className='w-full flex flex-row justify-start gap-10  ml-5'>
      <div className='flex flex-col justify-start h-192 rounded-xl border-3'>
        {[...inbox].reverse().map(tab => (
          <InboxTab
            key={tab.id}
            id={tab.id}
            room={tab.room}
            user={tab.user}
            selectedInbox={selectedInbox}
            setSelectedInbox={setSelectedInbox}
          >
            {tab.message}
          </InboxTab>
        ))}
      </div>

      <div>
        <ChatInterface selectedInbox={selectedInbox} setSelectedInbox={setSelectedInbox} setInbox={setInbox} />
      </div>
    </div>
  )
}

export default Inbox