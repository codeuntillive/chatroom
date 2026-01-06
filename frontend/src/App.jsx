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
  const { user, setUser } = useStore()
  const { setUserId } = useUserChatsStore()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3000/api/auth/user',
          { withCredentials: true ,headers: {
    "Cache-Control": "no-cache"
  }}
        )
        if (res.data.validate) {
          setUser(res.data.user)
          console.log("Setting userId in userChatsStore:", res.data.user.id);
          setUserId(res.data.user.id);  
        } else {
          setUser(null)
        }
        console.log("User data:", res.data)
      } catch (err) {
        console.log(err)
        setUser(null)
      }
    }

    fetchUser()
  }, [setUser])

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
