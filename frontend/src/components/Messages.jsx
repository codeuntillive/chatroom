import React, { useEffect, useRef, useState } from 'react'
import { useUserChatsStore } from '../zustnd/userChats'
import { useStore } from '../zustnd/store'
import '../style/messages.css'
import profile from '../assets/profile.png'
import Loading from './loading'
function Messages() {
  const { user } = useStore()
  const { userId, selectedUser, messages, isMessagesLoading, sendMessage } = useUserChatsStore()
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)
  console.log("Selected User in Messages:", selectedUser)
  

  useEffect(() => {
    if (messagesEndRef.current) {
      console.log("Scrolling to bottom of messages",messagesEndRef.current.scrollHeight)
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }

  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      sendMessage(selectedUser.id, newMessage)
      setNewMessage('')
    }
  }
  if (selectedUser === null) {
    return (
      <div className="messages">
        <p>Please select a chat to start messaging.</p>
      </div>
    )
  }
  if (isMessagesLoading) {
    return <Loading />
  } else {
    console.log("Messages:", messages)
  }
  


  return (
    <div className="messages">
      <div className="header-message">
        <div className="detail-message">
          <img src={profile} alt="" width={'40px'} />
          <div className="name">{selectedUser?.fullname}</div>
        </div>
        <div className="control-messages">
          :
        </div>
      </div>
      <div className="message-content" ref={messagesEndRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-box ${msg.sender_id === userId ? "sender" : "receiverd"
              }`}
          >
            <div className="message-content-text">
              {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
        ))}
      </div>
       
      <div className="input-message">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      {/* socket io integragion */}
      
    </div>
  )
}

export default Messages