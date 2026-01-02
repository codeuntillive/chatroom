import React from 'react'
import { useUserChatsStore } from '../zustnd/userChats'

function Chats() {
  const { allcontacts, isUsersLoading, selectedUser, setSelectedUser, getMessages } = useUserChatsStore()

  const handleSelectContact = (contact) => {
    setSelectedUser(contact)
    getMessages(contact.id)
  }

  return (
    <div className="contacts-list">
      {/* add chat list */}
    </div>
  )
}

export default Chats