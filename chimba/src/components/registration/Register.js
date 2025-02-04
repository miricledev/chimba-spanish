import React from 'react'
import { useRef, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

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
    <div>
        
        <form>
            <h2>Register details</h2>
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
            <label>Password</label>
            <input 
                type='text'
                required
                ref={password}
            />
            <ul>
                <li>At least 8 characters long</li>
                <li>Contains at least 1 number</li>
                <li>Contains at least 1 capital letter</li>
                <li>Contains at least 1 special character (#, !, @) etc</li>
            </ul>
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
            <button onClick={(event) => submitForm(event)}>Register</button>
            {submissionResponse && (<p>{submissionResponse}</p>)}
            <p>Already have an account? <Link to='/login'>Log in</Link></p>
        </form>
        
    </div>
  )
}

export default Register