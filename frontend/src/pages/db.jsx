import React, { useEffect, useState } from 'react'
import '../style/Dashboard.css'
import { useStore } from '../zustnd/store'
import { useUserChatsStore } from '../zustnd/userChats'
import Profile from '../components/Profile'
import Contacts from '../components/Contacts'
import Chats from '../components/Chats'
import Messages from '../components/Messages'

function Dashboard() {
  const { user, connectSocket } = useStore()
  const { userId, setUserId, getAllcontacts, activeTab, setActiveTab } = useUserChatsStore()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user && user.id && !userId) {
      setUserId(user.id)
      getAllcontacts()
    }
  }, [user, userId, setUserId, getAllcontacts])

  useEffect(() => {
    if (user) {
      connectSocket()
    }
  }, [user, connectSocket])

  return (
    <div className='dashboard'>
      <div className="sidebar">
        <div className="header">
          CONNECT
          <Profile />
          <div className="controls">
            <button className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')}>Chats</button>
            <button className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>Contacts</button>
          </div>
          
        </div>
        {activeTab === 'contacts' ? <Contacts searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> : <Chats />}
      </div>
      <Messages />
    </div>
  )
}

export default Dashboard
