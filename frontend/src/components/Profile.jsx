import React from 'react'
import { useStore } from '../zustnd/store'
import { useUserChatsStore } from '../zustnd/userChats'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import { toast } from 'react-toastify'

function Profile() {
  const { user, setUser } = useStore()
  const navigate = useNavigate()
  const {
    setUserId,
    setSelectedUser,
    setActiveTab,
    setIsUsersLoading
  } = useUserChatsStore()

  const handleLogout = async () => {
    try {
      await API.post(
        '/auth/logout',
        {}
      )

      setUser(null)
      setUserId(null)
      setSelectedUser(null)
      setActiveTab('chats')
      setIsUsersLoading(false)

      toast.success('Logged out successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data || 'Logout failed')
    }
  }

  return (
    <div className="profile-card">
      <div className="profile-avatar">
        {user?.name?.charAt(0).toUpperCase() || 'U'}
      </div>

      <div className="profile-info">
        <div className="profile-name">
          {user?.name || 'User'}
        </div>
        <div className="profile-email">
          {user?.email}
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default Profile
