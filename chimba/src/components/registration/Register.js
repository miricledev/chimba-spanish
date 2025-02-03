import React from 'react'
import { useRef } from 'react'
import axios from 'axios'

const Register = () => {

    // Form references
    const email = useRef()
    const firstName = useRef()
    const lastName = useRef()
    const password = useRef()
    const passwordConfirmed = useRef()
    const phone = useRef()
    

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
                res => console.log(res.data.reply)
            )
        } else{
            console.log("Passwords do not match")
        }
    }

  return (
    <div>
        Register details
        <form>
            <label>email</label>
            <input 
                type='text'
                required
                ref={email}
            />
            <label>first name</label>
            <input 
                type='text'
                required
                ref={firstName}
            />
            <label>last name</label>
            <input 
                type='text'
                required
                ref={lastName}
            />
            <label>password</label>
            <input 
                type='text'
                required
                ref={password}
            />
            <label>confirm password</label>
            <input 
                type='text'
                required
                ref={passwordConfirmed}
            />
            <label>phone number</label>
            <input 
                type='tel'
                required
                ref={phone}
            />
            <button onClick={(event) => submitForm(event)}>Submit form</button>
        </form>
    </div>
  )
}

export default Register