import React from 'react'
import { useRef, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Input from './Input'
import google from '/src/assets/register/google.png'
import { useAuth } from '../authorisation/AuthProvider'

const Register = () => {

    const { login } = useAuth()

    const nav = useNavigate()

    // Form references
    const email = useRef()
    const firstName = useRef()
    const lastName = useRef()
    const password = useRef()
    const phone = useRef()
    const checked = useRef()
    const checkedText = useRef()

    const [submissionResponse, setSubmissionResponse] = useState('')

    const [phase, setPhase] = useState(0)

    const headerText = [
        'Create an account',
        'Details',
        'Enter a password'
    ]

    const buttonText = [
        'Next',
        'Next',
        'Register'
    ]

    const submitForm = (e) => {
        e.preventDefault();
        console.log(password.current.value)

        if(phase < 2){
            if (checked.current.checked) {
                let allFilled = true; // Track if all inputs for this phase are filled
            
                if (phase === 0) {
                    if (!email.current.value) {
                        email.current.style.borderColor = "red";
                        allFilled = false;
                    }
                } 
                else if (phase === 1) {
                    [firstName, lastName, phone].forEach(input => {
                        if (!input.current.value) {
                            input.current.style.borderColor = "red";
                            allFilled = false;
                        } else{
                            input.current.style.borderColor = "light-grey"
                        }
                    });
                } 
                else if (phase === 2) {
                    if (!password.current.value) {
                        password.current.style.borderColor = "red";
                        allFilled = false;
                    }
                }
            
                if (allFilled) {
                    setPhase(prevPhase => prevPhase + 1); // Only move to the next phase if all inputs are filled
                }
            } else {
                checkedText.current.style.color = "red";
            }
            
        } else{
            // send data to backend
            axios.post("/api/register", {
                email: email.current.value,
                firstName: firstName.current.value,
                lastName: lastName.current.value,
                password: password.current.value,
                phone: phone.current.value
            }).then(
                res => {
                    setSubmissionResponse(res.data.reply)
                    login({email: email.current.value, password: password.current.value})
                }
            ).catch(
                error => console.log(error)
            )
        }
        
    }

  return (
    <div className='flex flex-col gap-4 justify-center items-center h-screen w-full'>
        <div className='flex flex-col gap-6'>
            <h2 className='font-bold text-4xl font-carlito'>{headerText[phase]}</h2>
            <form className='flex flex-col gap-3 justify-center'>

                <Input style={phase == 0 ? {display: 'flex'} : {display: 'none'}} ref={email}>Email</Input>
                <Input style={phase == 1 ? {display: 'flex'} : {display: 'none'}} ref={firstName}>First name</Input>
                <Input style={phase == 1 ? {display: 'flex'} : {display: 'none'}} ref={lastName}>Last name</Input>
                <Input style={phase == 2 ? {display: 'flex'} : {display: 'none'}} ref={password}>Password</Input>
                <Input style={phase == 1 ? {display: 'flex'} : {display: 'none'}} ref={phone}>Mobile number</Input>

                {submissionResponse && (<p>{submissionResponse}</p>)}
            </form>

            <div className='flex flex-row items-center gap-3' style={phase == 0 ? {display: 'flex'} : {display: 'none'}}>
                <input type='checkbox' ref={checked} />
                <p ref={checkedText} className='text-gray-400 text-sm'>You accept the privacy policy and terms of use</p>
            </div>

            <button className='btn btn-hover text-stroke-3 text-xl p-3 font-carlito rounded-xl w-100' onClick={(event) => submitForm(event)}>{buttonText[phase]}</button>
            
            <hr />

            <button className='btn-hover flex flex-row items-center justify-center p-3 w-100 border border-gray-300 rounded-xl'><img src={google} className='w-8 h-8' />Sign in with Google</button>

            <p className='font-carlito text-sm self-center'>Already have an account? <Link className='text-(--primary) underline' to='/login'>Log in</Link></p>
        </div>
 
    </div>
  )
}

export default Register