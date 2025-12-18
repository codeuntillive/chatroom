import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/db'
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3000/api/auth/user',
          { withCredentials: true ,headers: {
    "Cache-Control": "no-cache"
  }}
        )
        setUser(res.data.validate)
        console.log("User data:", res.data.validate)
      } catch (err) {
        console.log(err)
      }
    }

    fetchUser()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/otp" element={otp}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
