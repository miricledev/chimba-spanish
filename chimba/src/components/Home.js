import React from 'react'
import { useAuth } from './authorisation/AuthProvider'

const Home = () => {

    const {redirectIfNotLoggedIn} = useAuth()

    return redirectIfNotLoggedIn()

}

export default Home