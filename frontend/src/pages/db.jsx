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
  const {
    userId,
    setUserId,
    getAllcontacts,
    activeTab,
    setActiveTab
  } = useUserChatsStore()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user && user.id && !userId) {
      setUserId(user.id)
      getAllcontacts()
    }
  }, [user])

  useEffect(() => {
    if (user) connectSocket()
  }, [user])
if(sidebarOpen){
  if(document.body.clientWidth<768){
     
  }else{
    document.body.classList.remove('sidebar-open');
  }
}

  return (
    <div className="dashboard-root">

      {/* FLOATING SIDEBAR TOGGLE */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '⟨' : '⟩'}
      </button>

      <div className={`dashboard ${sidebarOpen ? '' : 'collapsed'}`}>

        {/* SIDEBAR */}
        <aside className="sidebar py-8">
          <div className="sidebar-top">
            <div className="brand ">CONNECT</div>
            <Profile />
          </div>

          <div className="sidebar-tabs">
            <button
              className={activeTab === 'chats' ? 'active' : ''}
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
            <button
              className={activeTab === 'contacts' ? 'active' : ''}
              onClick={() => setActiveTab('contacts')}
            >
              Contacts
            </button>
          </div>

          <div className="sidebar-body">
            {activeTab === 'contacts'
              ? <Contacts searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              : <Chats />}
          </div>
        </aside>

        {/* CHAT AREA */}
        <section className="chat-area">
          <Messages />
        </section>

      </div>
    </div>
  )
}

export default Dashboard
