import React, { useEffect } from 'react'
import { useUserChatsStore } from '../zustnd/userChats'
import loading from './loading'
function Contacts({ searchTerm, setSearchTerm }) {
  const {
    chats = [],
    searchUsers,
    isUsersLoading,
    setIsUsersLoading,
    selectedUser,
    setSelectedUser,
    getMessages
  } = useUserChatsStore()

  // Fetch contacts when search term changes
  useEffect(() => {
    if (!searchTerm) return

    const fetchContacts = async () => {
      try {
        setIsUsersLoading(true)
        await searchUsers(searchTerm)
      } catch (error) {
        console.error('Error fetching contacts:', error)
      } finally {
        setIsUsersLoading(false)
      }
    }

    fetchContacts()
  }, [searchTerm, searchUsers, setIsUsersLoading])

  const filteredContacts = chats.filter(contact =>
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
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

      <div className="contacts-list">
        {isUsersLoading ? (
          <loading />
        ) : (
          filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`contact ${
                selectedUser?.id === contact.id ? 'active' : ''
              }`}
              onClick={() => handleSelectContact(contact)}
            >
              <p>{contact.email}</p>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default Contacts
