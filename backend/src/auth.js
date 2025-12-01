import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { sendOTPEmail } from "./controller/sendotp.js";

// main
const router=express.Router();

// connect to database
const db = new pg.Client({
        user: "postgres",
        host: "localhost",
        database: "chatroom",
        password: "123456",
        port: 5432,
    });
try{
   
    db.connect();
}catch(err){
    console.log(err);
}
// code for authentication routes will go here
router.post("/register", async (req, res) => {
  const { fullname, email, password, profilepic } = req.body;

  try {
    if (!fullname || !email || !password || !profilepic) {
      return res.send({ validate: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.send({ validate: false, message: "Password must be at least 6 characters" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.send({ validate: false, message: "Invalid email format" });
    }

    let userCheck = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userCheck.rows.length > 0) {
      return res.send({ validate: false, message: "User already exists" });
    }

    // Wait for hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Add expiry time => 2 minutes
    const otpExpiry = Date.now() + 2 * 60 * 1000;

    // Save in session
    req.session.data = {
      fullname,
      email,
      passwordHash: hashedPassword,
      profilepic,
      otp,
      otpExpiry
    };

    const mess_otp = await sendOTPEmail(email, otp);

    if (mess_otp.messageId) {
      res.send({
        message: "OTP sent to email. Please verify to complete registration.",
        validate: true
      });
    } else {
      res.send({
        message: "Error sending OTP email.",
        validate: false,
        error: mess_otp
      });
    }

  } catch (err) {
    console.log(err);
  }
});

// otp verification route
router.post("/otp", async (req, res, next) => {
  const { otp } = req.body;

  if (!req.session.data) {
    return res.status(400).send({ validate: false, message: "No registration in progress" });
  }

  const { email, passwordHash, fullname, otp: sessionOtp, otpExpiry,profilepic } = req.session.data;

  // Check expiry
  if (Date.now() > otpExpiry) {
    req.session.data = null;
    return res.status(410).send({ validate: false, message: "OTP has expired. Please register again." });
  }

  if (parseInt(otp) !== sessionOtp) {
    return res.status(401).send({ validate: false, message: "Invalid OTP" });
  }

  try {
    await db.query("INSERT INTO users (fullname, email, password, profilepic) VALUES ($1, $2, $3,$4)", [
      fullname,
      email,
      passwordHash,
      profilepic
    ]);

    const newUser = { email:email,passpword:passwordHash };
    res.send({ validate: true, message: "Registration successful" });
    req.logIn(newUser, (err) => {
      if (err) return next(err);

      console.log("User registered & logged in:", newUser);

      req.session.data = null;  // Clear temporary session

      return res.status(201).send({
        validate: true,
        message: "Registration successful & user logged in",
        user: newUser
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).send({ validate: false, message: "Error during registration" });
  }
});



// export router
export default router;