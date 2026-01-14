import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import '../style/Login.css'
import gmailIcon from '../assets/gmail.png'
import passwordIcon from '../assets/password.png'
import pic from '../assets/pic.png'
import { useStore } from '../zustnd/store'

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
    <div className='container'>
      <div className="content">
        <div className="login">
          <div className="header">Login</div>
          <form action="" className='forms' onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username" className='emaillab'>Gmail</label>
              <div className="cont">
                <div><img src={gmailIcon} alt="" className="gmail" /></div>
                <input type="email" id='username' name='username' placeholder='Enter your email' value={formData.username} onChange={handleChange} required />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="password"className='passlab'>Password</label>
              <div className="cont">
                <div><img src={passwordIcon} alt="" className="password" /></div>
                <input type="password" id='password' name='password' placeholder='Enter your password' value={formData.password} onChange={handleChange} required />
              </div>
              <div className="forgot">Forgot Password?</div>
            </div>

            <button type='submit' className='login-btn' disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
              <div className="or">or</div>
        <button type='button' className='signup' onClick={() => navigate('/signup')}>Signup</button>
          </form>
        </div>
        <div className="pic"><img src={pic} alt="" srcSet="" className='pic'/></div>
      </div>
    </div>
  )
}

export default Login
