import React from 'react'
import { useUserChatsStore } from '../zustnd/userChats'

function Contacts({ searchTerm, setSearchTerm }) {
  const { allcontacts, isUsersLoading, selectedUser, setSelectedUser, getMessages } = useUserChatsStore()

  const filteredContacts = allcontacts.filter(contact =>
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectContact = (contact) => {
    setSelectedUser(contact)
    getMessages(contact.id)
  }

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        </div>
        {/* add list */}
    </>
  )
}

export default Contacts