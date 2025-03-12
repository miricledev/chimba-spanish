import axios from 'axios'
import React, { useState, useEffect } from 'react'
import UserCard from './UserCard'

const FindUsers = () => {

    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        axios.get('/api/users/getall').then(
            res => {
                const users = Object.values(res.data)

                setAllUsers(users.map((user, i) => <UserCard k={i} user_id={user[0]} firstName={user[1]} lastName={user[2][0].toUpperCase()} />))
            }
        )
    }, [])


  return (
    <div className='users-container'>{allUsers && allUsers}</div>
  )
}

export default FindUsers