import React, { useEffect, useRef, useState } from 'react'
import { useUserChatsStore } from '../zustnd/userChats'
import { useStore } from '../zustnd/store'

function Messages() {
  const { user } = useStore()
  const { userId, selectedUser, messages, isMessagesLoading, sendMessage } = useUserChatsStore()
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      sendMessage(selectedUser.id, newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="messages">
      {/* add messages */}
    </div>
  )
}

export default Messages