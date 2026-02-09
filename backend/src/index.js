import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import path from "path";
import authRouter from "./auth.js";
import { checkauth } from "./auth.js";
import messageRouter from "./message.js";
import {app,server} from './socket.js';
import { sessionMiddleware } from './sessionConfig.js';
dotenv.config();

app.use(cors({
  origin: ["http://localhost:5173","https://chatroom-z517.onrender.com/"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "cache-control"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);

// Passport
app.use(passport.initialize());
app.use(passport.session());
// const
const __dirname = path.resolve();


app.use("/api/auth", authRouter);
app.use("/api/message",checkauth, messageRouter);





if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname,'../frontend/dist')));
  app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
});

}



server.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});