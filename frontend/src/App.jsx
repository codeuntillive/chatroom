import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/db'
import Otp from './pages/otp'
import { useEffect } from 'react'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useStore } from './zustnd/store'
import {useUserChatsStore} from './zustnd/userChats'
function App() {
  const { user, setUser,connectSocket,socket,onlineUsers,getOnlineUsers } = useStore()
  const { setUserId } = useUserChatsStore()
  useEffect(() => {
    console.log("App useEffect: Fetching user on mount");
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3000/api/auth/user',
          { withCredentials: true ,headers: {
    "Cache-Control": "no-cache"
  }}
        )
        if (res.data.validate) {
          console.log("App fetchUser: User validated");
          getOnlineUsers();
          console.log(onlineUsers);
          setUser(res.data.user)
          console.log("Setting userId in userChatsStore:", res.data.user.id);
          setUserId(res.data.user.id);
        } else {
          console.log("App fetchUser: User not validated");
          setUser(null)
        }
        console.log("User data:", res.data)
      } catch (err) {
        console.log("App fetchUser: Error fetching user", err)
        setUser(null)
      }
    }

    fetchUser()
  }, [setUser])
  useEffect(() => {
    console.log("Socket or onlineUsers changed:", onlineUsers);
  }, [socket, onlineUsers]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={user ? <Navigate to="/dashboard"/> : <Login/>}/>
        <Route path='/signup' element={user ? <Navigate to="/dashboard"/> : <Signup/>} />
        <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/otp" element={<Otp />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
