import {create} from 'zustand';
import {useUserChatsStore} from './userChats';
import { SOCKET_URL } from '../api';
export const useStore = create((set,get) => ({
  user: null,
  socket: null,
  onlineUsers: [],
  setUser: (user) => set({ user }),
  setSocket: (socket) => set({ socket }),
  connectSocket: async () => {
      if (!get().user) {
          console.log("connectSocket: No user, skipping connection");
          return;
      }
      if (get().socket) {
          console.log("connectSocket: Socket already connected");
          return;
      }
      console.log("connectSocket: Attempting to connect socket for user:", get().user.id);
      const { io } = await import('socket.io-client');
      const socket = io(SOCKET_URL, {
          withCredentials: true,
      });
      socket.on('connect', () => {
          console.log("Socket connected successfully");
      });
      socket.on('connect_error', (error) => {
          console.log("Socket connection error:", error);
      });
      socket.on("message", (data) => {
          console.log("Received message:", data);
          useUserChatsStore.getState().addMessage(data);
      });
      socket.connect();
      set({ socket });
      socket.emit('get_online_users');
      socket.on("online_users", (data) => {
          console.log("Online users data:", data);
          set({ onlineUsers: data.onlineUsers });
      });
      socket.on("user_connected", (data) => {
        console.log("User connected data:", data);
          set({ onlineUsers: data.onlineUsers });
      });
      socket.on("user_disconnected", (data) => {
          set({ onlineUsers: data.onlineUsers });
      });
  },
  getOnlineUsers: () => {
      return get().onlineUsers;
  },
  disconnectSocket: () => {
      const socket = get().socket;
      if (socket) {
          socket.disconnect();
          set({ socket: null, onlineUsers: [] });
      } 
  },
}));