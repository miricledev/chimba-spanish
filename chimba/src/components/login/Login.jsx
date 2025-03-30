import React from 'react'
import { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../authorisation/AuthProvider'
import Input from '../registration/Input.jsx'
import google from '/src/assets/register/google.png'

const Login = () => {

  const {user, login} = useAuth()

  useEffect(() => {
    console.log('Entered login page: user state: ', user)

    // If user is already logged in, redirect from this page to dashboard
    if(user){
      return navigate('/1/')
    }

    window.addEventListener("keydown", (event) => {
      if(event.code === "Enter"){
        handleLogin(event)
      }
    })

    return () => window.removeEventListener("keydown", event)
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
    })
    .then(res => {
      if (res.data.user_data) {
        const user = res.data.user_data;
        login(user); // update auth context
  
        // Redirect based on account type
        if (user.account_type === 2) {
          navigate('/2/');
        } else {
          navigate('/1/');
        }
  
      } else {
        setLoginResponse(res.data.reply);
      }
    })
    .catch(error => {
      console.log(error);
      setLoginResponse(error.message);
    });
  };
  

  return (  
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <form className='flex flex-col gap-5'>
            <h2 className='font-bold text-4xl font-carlito'>Welcome back</h2>

            <Input ref={email}>Email</Input>
            <Input ref={password}>Password</Input>

            <button className='btn btn-hover text-stroke-3 text-xl p-3 font-carlito rounded-xl w-100' onClick={(event) => handleLogin(event)}>Log in</button>

            {loginResponse && (<p style={errorStyle}>{loginResponse}</p>)}

            <hr />

            <button className='btn-hover flex flex-row items-center justify-center p-3 w-100 border border-gray-300 rounded-xl'><img src={google} className='w-8 h-8' />Sign in with Google</button>

            <p className='font-carlito text-sm self-center'>New to our platform? <Link className='text-(--primary) underline' to='/register'>Create an account</Link></p>
          </form>
        </div>
  );
  
}

export default Login;