import React, { useEffect } from 'react'
import { useAuth } from '../../authorisation/AuthProvider'
import { Outlet } from 'react-router-dom'
import { MdLibraryBooks, MdGroup, MdOutlineLibraryAdd } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import { PiCoffeeDuotone } from 'react-icons/pi'
import Sideicon from '../../../navbars/Sideicon'

const TeacherSidebar = () => {
  const { user, logout, redirectIfNotLoggedIn, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      redirectIfNotLoggedIn()
    }
  }, [loading, user])

  if (loading) return <p>Checking authentication...</p>

  return user ? (
    <div className="flex flex-row">
      <div className="fixed flex justify-start items-center sm:gap-2 2xl:gap-5 p-15 h-screen flex-col flex-start w-[100] bg-(--primary)">
        <h2 className="font-baloo2 sm:text-5xl 2xl:text-7xl p-7 text-white font-bold drop-shadow-sm btn-hover">
          Chimba
        </h2>
        <h3 className="text-lg">Hello, <span className="font-bold">{user.firstName}</span> 👨‍🏫</h3>
        <div className="flex flex-col items-start gap-1">
          <Sideicon Icon={MdLibraryBooks} link={'/2/'}>My Lessons</Sideicon>
          <Sideicon Icon={MdOutlineLibraryAdd} link={'/2/create-lesson'}>Create Lesson</Sideicon>
          <Sideicon Icon={CgProfile} link={'/2/profile'}>Profile</Sideicon>
        </div>
        <button onClick={logout} className="navbar-button mt-5 text-white text-lg font-bold px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition">
          Log Out
        </button>
      </div>
      <div className="ml-100 p-10"><Outlet /></div>
    </div>
  ) : (
    <p className="redirect-message">Redirecting to login page...</p>
  )
}

export default TeacherSidebar
