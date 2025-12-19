import React from 'react'
import '../style/Login.css'
function Login() {
  return (
    <div className='container'>
      <div className="content">
        <div className="login">
          <div className="header">Login</div>
          <form action="" className='forms'>
            <div className="input-group">
              <label htmlFor="username">*email</label>
              <div className="cont">
                <div>img</div>
               <input type="text" id='username' placeholder='Enter your email' />
              </div>
              
            </div>
            <div className="input-group">
              <label htmlFor="password">*Password</label>
              <div className="cont">
                <div>img</div>
                <input type="password" id='password' placeholder='Enter your password' />
              </div>
              <div className="forgot">Forgot Password?</div>  
            </div>

            <button type='submit' className='login-btn'>Login</button>
             <div className="or">or</div>
        <button className='signup'>Signup</button>
          </form>
          
        </div>
        <div className="pic"></div>
      </div>
    </div>
  )
}

export default Login
