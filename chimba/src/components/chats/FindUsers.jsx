import axios from 'axios'
import React, { useState, useEffect } from 'react'
import UserCard from './UserCard'
import filter from '/src/assets/filter.png'
import { useAuth } from '../authorisation/AuthProvider'

const FindUsers = () => {

    const [allUsers, setAllUsers] = useState([])
    const [showFilter, setShowFilter] = useState(false)

    const { user } = useAuth()

    useEffect(() => {
      axios.get('/api/users/getall').then(
        res => {
          const users = Object.values(res.data)

          setAllUsers(
            users
            .filter(
              u => u[0] != user.id 
            )
            .map(
              (user, i) => <UserCard k={i} user_id={user[0]} firstName={user[1]} lastName={user[2][0].toUpperCase()} />
            )
          )
        }
      )
    }, [])

    const toggleFilter = () => {
      setShowFilter(prev => !prev)
    }


    return (
      <div className='ml-5 w-full gap-8 flex flex-col justify-center'>
        <div className='flex flex-row p-3 gap-15 items-center justify-start'>
          <div className='flex flex-row gap-3 items-center'> 
            <h1 className='font-bold text-4xl font-carlito'>
              {allUsers && allUsers.length} Users Found
            </h1>
            <img onClick={toggleFilter} src={filter} className='w-15 h-15 btn-hover' />
          </div>
        { showFilter && ( <div className='flex flex-row gap-3 items-center border-2 border-gray-500 rounded-xl p-2'>
            <h3 className='font-carlito text-2xl'>Filter by:</h3>
            <select className='font-carlito text-2xl'><option>Dialect</option></select>
            <select className='font-carlito text-2xl'><option>Gender</option></select>
            <button className='font-carlito btn text-stroke-3 text-2xl btn-hover flex flex-row items-center justify-center p-1 w-35 border border-gray-300 rounded-xl'>Apply filter</button>
          </div>)}
        </div>
        
        <div className='flex flex-row w-full justify-start items-center flex-wrap gap-7'>{allUsers && allUsers}</div>
      </div>
  )
}

export default FindUsers