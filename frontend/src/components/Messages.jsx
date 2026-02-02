import React, { useEffect, useRef, useState } from 'react'
import { useUserChatsStore } from '../zustnd/userChats'
import { useStore } from '../zustnd/store'
import '../style/messages.css'
import profile from '../assets/profile.png'
import Loading from './loading'
import io from 'socket.io-client'
function Messages() {
  const { user } = useStore()
  const { userId, selectedUser, messages, isMessagesLoading, sendMessage, addMessage } = useUserChatsStore()
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)
  console.log("Selected User in Messages:", selectedUser)
  const textarea = useRef(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      console.log("Scrolling to bottom of messages", messagesEndRef.current.scrollHeight)
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }

  }, [messages])

  useEffect(() => {
    if (userId) {
      socketRef.current = io('http://localhost:3000', {
        withCredentials: true,
      })

      socketRef.current.on('message', (data) => {
        console.log('Received message:', data)
        if (data.sender_id !== userId && data.receiver_id === userId) {
          addMessage(data)
        }
      })

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect()
        }
      }
    }
  }, [userId, addMessage])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      textarea.current.style.height = 'auto';
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
    return <div className='w-[100%] h-[100%] flex justify-center items-center'><div className=' text-3xl text-green-600'>Loading....</div></div>
  } else {
    console.log("Messages:", messages)
  }



  return (
    <div className="messages">
      <div className="header-message">
        <div className="detail-message">
          <div className="profile-avatar">
            {selectedUser?.fullname?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="info">
            <div className="name">{selectedUser?.fullname}</div>
            <div className="email">{selectedUser?.email}</div>
          </div>
        </div>
        <div className="control-messages">
          :
        </div>
      </div>
      <div className="message-content" ref={messagesEndRef}>
        {messages.map((msg) =>
          msg.sender_id !== userId ? (
            <div>
              <div class="chat-header">
                <span className='mx-2'> {selectedUser.fullname}</span>
                <time class="text-xs opacity-50">{(msg.datetime).split('T')[0]}  {(msg.datetime).split('T')[1].slice(0, 8)}</time>

              </div>
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">

                    <div className="profile-avatar">
                      {selectedUser?.fullname?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                </div>

                <div className="chat-bubble whitespace-pre-wrap bg-blue-700 text-xl">{msg.text}</div>
              </div>
            </div>
          ) : (
            <div className=' flex flex-col '>
              <div class="chat-header flex justify-end">
                <time class="text-xs opacity-50">{(msg.datetime).split('T')[0]}  {(msg.datetime).split('T')[1].slice(0, 8)}</time>
                <span className='mx-2'> {user.fullname}</span>

              </div>
              <div className="chat chat-end ">


                <div className="chat-bubble whitespace-pre-wrap bg-green-700 text-xl">{msg.text}</div>
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <div className="profile-avatar">
                      {user?.fullname?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <div className="input-message">
        <textarea
          ref={textarea}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className=' text-black'
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.target.style.height = 'auto';
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage} className=' mx-3'>Send</button>
      </div>
      {/* socket io integragion */}

    </div>
  )
}

export default Messages