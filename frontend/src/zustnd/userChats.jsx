import { create } from "zustand";

export const useUserChatsStore = create((set, get) => ({
  /* ===================== STATE ===================== */
  userId: null,                 // logged-in user
  allcontacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,

  isUsersLoading: false,
  isMessagesLoading: false,

  /* ===================== SETTERS ===================== */
  setUserId: (id) => set({ userId: id }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsUsersLoading: (isLoading) => set({ isUsersLoading: isLoading }),
  /* ===================== FETCH CONTACTS ===================== */
  getAllcontacts: async () => {
    const userId = get().userId;
    if (!userId) return;

    set({ isUsersLoading: true });

    try {
      const response = await fetch(
        `http://localhost:3000/api/message/contacts/${userId}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const data = await response.json();
      set({ allcontacts: data });
    } catch (error) {
      console.error("Contacts error:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  /* ===================== SEARCH USERS ===================== */
  searchUsers: async (email) => {
    set({ isUsersLoading: true });

    try {
      const response = await fetch(
        `http://localhost:3000/api/message/searchUsers/${get().userId}/${email}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      const data = await response.json();
      set({ chats: data });
    } catch (error) {
      console.error("Search users error:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  /* ===================== FETCH MESSAGES ===================== */
  getMessages: async (otherUserId) => {
    const myUserId = get().userId;
    if (!myUserId || !otherUserId) return;

    set({ isMessagesLoading: true });

    try {
      const response = await fetch(
        `http://localhost:3000/api/message/messages/${myUserId}/${otherUserId}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      set({ messages: data });
    } catch (error) {
      console.error("Messages error:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  /* ===================== SEND MESSAGE ===================== */
  sendMessage: async (receiverId, text, img = null) => {
    const senderId = get().userId;
    if (!senderId || !receiverId) return;

    try {
      const response = await fetch("http://localhost:3000/api/message/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          senderId,
          receiverId,
          textt: text,
          imgg: img,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      // Optionally, update the messages state with the new message
      const currentMessages = get().messages;
      set({ messages: [...currentMessages, data] });
    } catch (error) {
      console.error("Send message error:", error);
    }
  },

  /* ===================== RESET (LOGOUT) ===================== */
  resetChatState: () =>
    set({
      allcontacts: [],
      chats: [],
      messages: [],
      selectedUser: null,
      activeTab: "chats",
    }),
}));

