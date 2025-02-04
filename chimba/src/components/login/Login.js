import React from 'react'
import { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../authorisation/AuthProvider'

const Login = () => {

  const {user, login} = useAuth()

  useEffect(() => {
    console.log('Entered login page: user state: ', user)

    // If user is already logged in, redirect from this page to dashboard
    if(user){
      return navigate('/1/')
  }
  }, [])

  // The message after failed log in
  const [loginResponse, setLoginResponse] = useState('')

  const email = useRef()
  const password = useRef()

  const navigate = useNavigate()


  // text that appears when there is some error logging in shown to UI
  const errorStyle ={
    color: 'red',
    marginTop: '.1px'
  }

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post("/api/login", {
      email: email.current.value,
      password: password.current.value
    }).then(
      res => {
        if(res.data.user_data){
          login(res.data.user_data)
          navigate('/1/')
          } else{
            setLoginResponse(res.data.reply)
          }
        }
    ).catch(
      error => {
        console.log(error)
        setLoginResponse(error.message)
      }
    )
  }

  return (
    <div>
      
      <form>
        <h2>Login:</h2>
        <input type='text' placeholder='email' ref={email} />
        <input type='password' placeholder='password' ref={password} />
        <button onClick={(event) => handleLogin(event)}>Log in</button>
        {loginResponse && (<p style={errorStyle}>{loginResponse}</p>)}
        <p>No account registered? <Link to='/register'>Register here</Link></p>
      </form>
    </div>
  )
}

export default Login;