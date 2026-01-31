import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import '../style/Login.css'
import gmailIcon from '../assets/gmail.png'
import passwordIcon from '../assets/password.png'
import pic from '../assets/pic.png'
import { useStore } from '../zustnd/store'
import Navbar from '../components/navbar'

function Login() {
  const { setUser } = useStore()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
      const res = await axios.post('http://localhost:3000/api/auth/login', formData, { withCredentials: true })
      if (res.status === 200) {
        
        const userRes = await axios.get('http://localhost:3000/api/auth/user', { withCredentials: true })
        if (userRes.data.validate) {
          console.log('Fetched user data:', userRes.data.user)
          setUser(userRes.data.user)
        }
        toast.success('Logged in successfully!')
        navigate('/dashboard')
      }
    } catch (err) {

      toast.error(err.response?.data || 'Login failed')
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
  <div className=''>            
  <Navbar/>
  <div className="auth-wrapper">
    
    <div className="auth-card">
      <h1 className="auth-title">Welcome Back</h1>
      <p className="auth-subtitle">
        Sign in to your secure messaging account
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email */}
        <label>Email Address</label>
        <div className="auth-input">
          <img src={gmailIcon} alt="email" />
          <input
            type="email"
            name="username"
            placeholder="you@example.com"
            value={formData.username}
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Options */}
        

        <button className="auth-btn " disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In →'}
        </button>
        <div className="auth-footer">
          <span>don't have an account?</span>
          <button
            type="button"
            className="auth-link"
            onClick={() => navigate('/signup')}
          >
            Signup
          </button>
        </div>
      </form>
    </div>
  </div>
  </div>
)

}

export default Login
