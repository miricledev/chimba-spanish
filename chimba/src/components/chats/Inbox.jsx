import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ChatInterface from './ChatInterface'
import { useAuth } from '../authorisation/AuthProvider'
import InboxTab from './InboxTab'

const Inbox = () => {

  const [inbox, setInbox] = useState([])

  const { user } = useAuth()

  useEffect(() => {
    axios.post('/api/get-inbox', {id: user.id}).then(
        res => {
          console.log(Object.values(res.data))
          setInbox(Object.values(res.data).map(i => {
          return(
            <InboxTab room={i[1]} user={`User ${i[3]}`}>{i[4]}</InboxTab>
          )
        }))
      }
    )
  }, [])

  return (
    <div className='w-full flex flex-row justify-center gap-10  ml-5'>
      <div className='flex flex-col justify-start'>
        {inbox}
      </div>

      <div>
        <ChatInterface setInbox={setInbox} />
      </div>
    </div>
  )
}

export default Inbox