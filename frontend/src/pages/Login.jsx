import React from 'react'
import '../style/Login.css'
import gmailIcon from '../assets/gmail.png'
import passwordIcon from '../assets/password.png'
import pic from '../assets/pic.png'
function Login() {
  return (
    <div className='container'>
      <div className="content">
        <div className="login">
          <div className="header">Login</div>
          <form action="" className='forms'>
            <div className="input-group">
              <label htmlFor="username" className='emaillab'>Gmail</label>
              <div className="cont">
                <div><img src={gmailIcon} alt="" className="gmail" /></div>
               <input type="text" id='username' placeholder='Enter your email' />
              </div>
              
            </div>
            <div className="input-group">
              <label htmlFor="password"className='passlab'>Password</label>
              <div className="cont">
                <div><img src={passwordIcon} alt="" className="password" /></div>
                <input type="password" id='password' placeholder='Enter your password' />
              </div>
              <div className="forgot">Forgot Password?</div>  
            </div>

            <button type='submit' className='login-btn'>Login</button>
             <div className="or">or</div>
        <button className='signup'>Signup</button>
          </form>
          
        </div>
        <div className="pic"><img src={pic} alt="" srcset="" className='pic'/></div>
      </div>
    </div>
  )
}

export default Login
