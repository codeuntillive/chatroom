import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import { toast } from 'react-toastify'
import '../style/Login.css'
import Navbar from '../components/navbar'
function Otp() {
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [timer, setTimer] = useState(120)
  const inputsRef = useRef([])
  const navigate = useNavigate()

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pasted)) return

    const newOtp = pasted.split('')
    setOtp(newOtp)
    inputsRef.current[5].focus()
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const finalOtp = otp.join('')

    if (finalOtp.length < 6) {
      toast.error('Please enter complete OTP')
      return
    }

    try {
      const res = await API.post(
        '/auth/otp',
        { otp: finalOtp }
      )

      if (res.data.validate) {
        toast.success('Registration successful! Please login.')
        navigate('/login')
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error('Error verifying OTP')
      console.log(err)
    }
  }

  const handleResend = async () => {
    if (timer > 0) return

    try {
      const res = await API.post(
        '/auth/resend-otp',
        {}
      )

      if (res.data.validate) {
        toast.success('OTP resent successfully.')
        setTimer(120)
        setOtp(Array(6).fill(''))
        inputsRef.current[0].focus()
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error('Error resending OTP')
      console.log(err)
    }
  }

  return (
    <div>
      <Navbar></Navbar>
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Verify OTP</h2>
        <p className="auth-subtitle">
          Enter the 6-digit code sent to your email
        </p>

        <form className="auth-form" onSubmit={handleVerify}>
          <div className="otp-boxes" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                className="otp-input"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button type="submit" className="auth-btn">
            Verify
          </button>

          <div className="auth-options" style={{ justifyContent: 'center' }}>
            <span
              className="forgot"
              onClick={handleResend}
              style={{
                pointerEvents: timer > 0 ? 'none' : 'auto',
                opacity: timer > 0 ? 0.6 : 1
              }}
            >
              {timer > 0
                ? `Resend in ${Math.floor(timer / 60)}:${(timer % 60)
                    .toString()
                    .padStart(2, '0')}`
                : 'Resend OTP'}
            </span>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Otp
