import React, {useEffect} from 'react'
import { useAuth } from './AuthProvider'
import { Outlet, Link } from 'react-router-dom'

const AuthorisedPagesProtector = () => {

    const {user, logout, redirectIfNotLoggedIn} = useAuth()

    useEffect(() => {
        console.log('User state on authorised page', user)
    }, [])

    useEffect(() => {
        redirectIfNotLoggedIn()
    }, [user])

  return user ? (
    <div>
        <button onClick={logout}>Log out</button>
        <Link to='/1/'>Dashboard</Link>
        <Outlet />
    </div>
  ) : <p>Redirecting to login page</p>
}

export default AuthorisedPagesProtector