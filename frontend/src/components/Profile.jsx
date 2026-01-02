import React from 'react'
import { useStore } from '../zustnd/store'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function Profile() {
  const { user, setUser } = useStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true })
      setUser(null)
      toast.success('Logged out successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data || 'Logout failed')
    }
  }

  return (
    <div className="profile" style={{display:'flex'}}>
      <div className="profile-pic">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
      <div className="name">{user?.name || user?.email || 'User'}</div>
      <button className='logout-btn' style={{display:"block"}} onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Profile