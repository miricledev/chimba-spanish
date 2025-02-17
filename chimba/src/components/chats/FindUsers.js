import axios from 'axios'
import React, { useState, useEffect } from 'react'
import UserCard from './UserCard'
import './chats.css'

const FindUsers = () => {

    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        axios.get('/users/getall').then(
            res => {
                const users = Object.values(res.data)

                setAllUsers(users.map(user => <UserCard user_id={user[0]} firstName={user[1]} lastName={user[2][0].toUpperCase()} />))
            }
        )
    }, [])


  return (
    <div className='users-container'>{allUsers && allUsers}</div>
  )
}

export default FindUsers