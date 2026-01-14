import {create} from 'zustand';

export const useStore = create((set,get) => ({
  user: null,
  socket: null,
  onlineUsers: [],
  setUser: (user) => set({ user }),
  setSocket: (socket) => set({ socket }),
  connectSocket: async () => {
      if (!get().user) return;
      const { io } = await import('socket.io-client');
      const socket = io('http://localhost:3000', {
          withCredentials: true,
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