import React, { useEffect } from 'react'
import { useUserChatsStore } from '../zustnd/userChats'
import Loading from './loading'
function Chats() {
  const { allcontacts, isUsersLoading, selectedUser, setSelectedUser, getMessages,setIsUsersLoading,getAllcontacts, userId } = useUserChatsStore()
  useEffect(()=>{
    const data=(async()=>{
      setIsUsersLoading(true)
    try {
      await getAllcontacts();
      console.log("Contacts fetched successfully",allcontacts);
      setIsUsersLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
    })
    data()

  },[])

  const handleSelectContact = (contact) => {
    setSelectedUser(contact)
    getMessages(contact.id)
  }
  if (isUsersLoading) {
    return <Loading />
  }
  if (!Array.isArray(allcontacts) || allcontacts.length === 0) {
    return <div className="no-contacts">No contacts found.</div>
  }
  return(
    <div className="contact-list">
      {allcontacts.map((contact)=>(
        <div className="contact" key={contact.id} onClick={() => handleSelectContact(contact)}>
          <div className="profile-cont">P</div>
          <div className="info">
            <div className="name">{contact.fullname}</div>
            <div className="email">{contact.email}</div>
          </div>
          {selectedUser && selectedUser.id === contact.id && <div className="selected-indicator">✓</div>}
        </div>
      ))}

    </div>
  )
  
}
export default Chats