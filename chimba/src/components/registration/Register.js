import React from 'react'
import { useRef, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './register.css'

const Register = () => {

    // Form references
    const email = useRef()
    const firstName = useRef()
    const lastName = useRef()
    const password = useRef()
    const passwordConfirmed = useRef()
    const phone = useRef()

    const [submissionResponse, setSubmissionResponse] = useState('')
    

    const submitForm = (e) => {
        e.preventDefault();
        console.log(password.current.value)
        console.log(passwordConfirmed.current.value)
        if(passwordConfirmed.current.value===password.current.value){
            // send data to backend
            axios.post("/api/register", {
                email: email.current.value,
                firstName: firstName.current.value,
                lastName: lastName.current.value,
                password: password.current.value,
                phone: phone.current.value
            }).then(
                res => setSubmissionResponse(res.data.reply)
            ).catch(
                error => console.log(error)
            )
        } else{
            console.log("Passwords do not match")
        }
    }

  return (
    <div className='form-container'>
        <h2>Register details</h2>
        <form className='form-box'>
            <div className='side-register'>

                
                <label>Email Address</label>
                <input 
                    type='text'
                    required
                    ref={email}
                />
                <label>First Name</label>
                <input 
                    type='text'
                    required
                    ref={firstName}
                />
                <label>Last Name</label>
                <input 
                    type='text'
                    required
                    ref={lastName}
                />
            </div>
            <div className='side-register'>

                <label>Password</label>
                <input 
                    type='text'
                    required
                    ref={password}
                />
                <label>Confirm Password</label>
                <input 
                    type='text'
                    required
                    ref={passwordConfirmed}
                />
                <label>Phone Number</label>
                <input 
                    type='tel'
                    required
                    ref={phone}
                />
                
                {submissionResponse && (<p>{submissionResponse}</p>)}
                
            </div>
        </form>
        <button onClick={(event) => submitForm(event)}>Register</button>
        <p>Already have an account? <Link to='/login'>Log in</Link></p>
    </div>
  )
}

export default Register