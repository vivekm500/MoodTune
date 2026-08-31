import React, { useState } from 'react'
import '../../shared/styles/login.scss'
import FormGroup from '../components/FormGroup'
import {Link} from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'


const Login = () => {

const {user, loading, handleLogin} = useAuth()

const navigate = useNavigate()

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

async function handleSubmit(e){
  e.preventDefault()
  const loggedIn = await handleLogin({email, password})
  console.log(loggedIn)
  if(loggedIn){
  navigate("/")
}
}


  return (
    <main className="login-page">
        <div className='form-container'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                    <FormGroup 
                    value = {email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    label="Email" placeholder="Email" />

                    <FormGroup
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}} 
                    label="Password" placeholder="Password" />
                <button className='button' type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </main>
  )
}

export default Login
