import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Register from './components/registration/Register'
import Login from './components/login/Login'

const App = () => {

  return (
    <div>
      <Register />
      <hr />
      <Login />
    </div>
  )
}

export default App
