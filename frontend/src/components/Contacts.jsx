import React, { useEffect } from 'react'
import { useUserChatsStore } from '../zustnd/userChats'
import Loading from './loading'

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
    getMessages()
  }

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input text-black border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="contact-list flex flex-col my-6 overflow-y-scroll scrollbar-none">
        {isUsersLoading ? (
          <Loading />
        ) : filteredContacts.length === 0 ? (
          <div className="no-contacts">No contacts found.</div>
        ) : (
          filteredContacts.map(contact => (
            <div className="contact" key={contact.id} onClick={() => handleSelectContact(contact)}>
              <div className="profile-avatar">
                {contact?.fullname?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="info">
                <div className="name" id="name">{contact.fullname}</div>
                <div className="email">{contact.email}</div>
              </div>
              {selectedUser && selectedUser.id === contact.id && <div className="selected-indicator"></div>}
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default Contacts
