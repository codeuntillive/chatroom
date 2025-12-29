import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import '../style/Signup.css'
import gmailIcon from '../assets/gmail.png'
import passwordIcon from '../assets/password.png'
import pic from '../assets/pic.png'
import profileIcon from '../assets/profile.png'

function Signup() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    profilepic: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', formData, { withCredentials: true })
      if (res.data.validate) {
        toast.success('OTP sent to your email. Please verify.')
        navigate('/otp')
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error('Error during registration')
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container'>
      <div className="content">
        <div className="signup-form">
          <div className="header">Signup</div>
          <form action="" className='forms' onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="fullname" className='namelab'>Full Name</label>
              <div className="cont">
                <div><img src={profileIcon} alt="" className="profile" /></div>
                <input type="text" id='fullname' name='fullname' placeholder='Enter your full name' value={formData.fullname} onChange={handleChange} required />
              </div>
              
            </div>
            <div className="input-group">
              <label htmlFor="email" className='emaillab'>Gmail</label>
              <div className="cont">
                <div><img src={gmailIcon} alt="" className="gmail" /></div>
                <input type="email" id='email' name='email' placeholder='Enter your email' value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="password" className='passlab'>Password</label>
              <div className="cont">
                <div><img src={passwordIcon} alt="" className="password" /></div>
                <input type="password" id='password' name='password' placeholder='Enter your password' value={formData.password} onChange={handleChange} required />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="profilepic" className='piclab'>Profile Picture URL</label>
              <div className="cont">
                
                <input type="text" id='profilepic' name='profilepic' placeholder='Enter profile picture URL' value={formData.profilepic} onChange={handleChange} required />
              </div>
            </div>

            <button type='submit' className='signup-btn' disabled={isLoading}>{isLoading ? 'Signing up...' : 'Signup'}</button>
            <div className="or">or</div>
            <button type='button' className='login-link' onClick={() => navigate('/login')}>Login</button>
          </form>
        </div>
        <div className="pic"><img src={pic} alt="" srcset="" className='pic'/></div>
      </div>
    </div>
  )
}

export default Signup