import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import '../style/Signup.css'
import gmailIcon from '../assets/gmail.png'
import passwordIcon from '../assets/password.png'
import pic from '../assets/pic.png'
import profileIcon from '../assets/profile.png'
import Navbar from '../components/navbar'

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
    <div>
    <Navbar></Navbar>
  <div className="auth-wrapper">
    <div className="auth-card">
      <h1 className="auth-title">Create Account</h1>
      <p className="auth-subtitle">
        Sign up to start secure messaging
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <label>Full Name</label>
        <div className="auth-input">
          <img src={profileIcon} alt="name" />
          <input
            type="text"
            name="fullname"
            placeholder="Your full name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <label>Email Address</label>
        <div className="auth-input">
          <img src={gmailIcon} alt="email" />
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <label>Password</label>
        <div className="auth-input">
          <img src={passwordIcon} alt="password" />
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Profile Pic */}
        <label>Profile Picture URL</label>
        <div className="auth-input">
          <img src={profileIcon} alt="profile" />
          <input
            type="text"
            name="profilepic"
            placeholder="https://image.url"
            value={formData.profilepic}
            onChange={handleChange}
            required
          />
        </div>

        <button className="auth-btn" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign Up →'}
        </button>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <button
            type="button"
            className="auth-link"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
  </div>
  )
}

export default Signup