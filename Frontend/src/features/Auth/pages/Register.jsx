import FormGroup from "../components/FormGroup"
import '../../shared/styles/register.scss'
import {Link} from 'react-router'
import {useAuth} from "../hooks/useAuth"
import { useState } from "react"
import { useNavigate } from "react-router"


const Register = () => {

  const {user, loading, handleRegister} = useAuth();

  const navigate = useNavigate()

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e){
    e.preventDefault()
    await handleRegister({username, email, password})
    navigate("/login")
  }

  return (
    < main className="register-page">
        <div className='form-container'>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <FormGroup
                value={username}
                onChange={(e)=>{setUsername(e.target.value)}} 
                label="Username" placeholder="Username" />
                <FormGroup 
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}} 
                label="Email" placeholder="Email" />
                <FormGroup 
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}} 
                label="Password" placeholder="Password" />
        
                <button className='button' type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
        < main/>
    </main>
  )
}

export default Register
