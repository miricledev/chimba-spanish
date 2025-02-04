import React from 'react'
import { useAuth } from '../authorisation/AuthProvider'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const {user} = useAuth()
  return (
    <div>
        Dashboard
        <hr />
        Hello {user}
    </div>
  )
}

export default Dashboard