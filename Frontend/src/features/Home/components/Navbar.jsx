import React from 'react'
import '../styles/navbar.scss'
import { Link, useNavigate } from 'react-router'

const Navbar = () => {

    const navigate = useNavigate()

  return (
    <main className='nav'>
        <div className='logo'>
            <p>MoodTune</p>
        </div>
        <div className='nav-elements'>
            <Link to='/login' >Login</Link>
            <Link to='register'>Register</Link>

        </div>
    </main>
  )
}

export default Navbar
