import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import path from "path";
import authRouter from "./auth.js";
import { checkauth } from "./auth.js";
import messageRouter from "./message.js";
dotenv.config();

const app = express();
app.use(cors({Credential:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'the secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } 
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
// const
const __dirname = path.resolve();


// routes will go here
app.use("/api/auth", authRouter);
app.use("/api/message",checkauth, messageRouter);




// reday for deployment
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname,'../frontend/dist')));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'../frontend/dist/index.html'));
  })
}



app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});