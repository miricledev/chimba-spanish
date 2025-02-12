import React from 'react'
import { useAuth } from '../authorisation/AuthProvider'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const {user} = useAuth()
  return (
    <div>
        Dashboard
        <hr />
        Hello {user.firstName}
        <Link to='flashcards/'>Flashcards</Link>
        <Link to='map/'>Map</Link>
        <Link to='aichat/'>AI Chat</Link>
        <Link to='readingcomp'>Reading</Link>
    </div>
  )
}

export default Dashboard