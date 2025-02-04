import React from 'react'
import { useRef } from 'react'
import axios from 'axios'

const Login = () => {

  const email = useRef()
  const password = useRef()

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post("/api/login", {
      email: email.current.value,
      password: password.current.value
    }).then(
      res => console.log(res.data)
    ).catch(
      error => console.log(error)
    )
  }

  return (
    <div>
      <h2>Login:</h2>
      <form>
        <input type='text' placeholder='email' ref={email} />
        <input type='password' placeholder='password' ref={password} />
        <button onClick={(event) => handleLogin(event)}>Log in</button>
      </form>
    </div>
  )
}

export default Login;