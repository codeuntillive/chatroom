import { create } from "zustand";
import API from "../api";

export const useUserChatsStore = create((set, get) => ({
  /* ===================== STATE ===================== */
  userId: null,                 // logged-in user
  allcontacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  socket: null,

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
      const response = await API.get(`/message/contacts/${userId}`);

      set({ allcontacts: response.data });
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
      const response = await API.get(
        `/message/searchUsers/${get().userId}/${email}`
      );

      set({ chats: response.data });
    } catch (error) {
      console.error("Search users error:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  /* ===================== FETCH MESSAGES ===================== */
  getMessages: async () => {
    const myUserId = get().userId;
    const otherUserId = get().selectedUser?.id;
    if (!myUserId || !otherUserId) return;

    set({ isMessagesLoading: true });

    try {
      const response = await API.get(
        `/message/messages/${myUserId}/${otherUserId}`
      );

      set({ messages: response.data });
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
      const response = await API.post("/message/text", {
        senderId,
        receiverId,
        textt: text || null,
        imgg: img || null,
      });

      const data = response.data;
      const currentMessages = get().messages;
      set({ messages: [...currentMessages, data] });
    } catch (error) {
      console.error("Send message error:", error);
    }
  },

  /* ===================== ADD MESSAGE ===================== */
  addMessage: (message) => {
    const currentMessages = get().messages;
    set({ messages: [...currentMessages, message] });
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
