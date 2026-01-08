import {Server} from "socket.io";
import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import {socketAuthMiddleware} from './middleware/socketAuthMiddleware.js';
// server
const app=express();
// env
dotenv.config();
const server=http.createServer(app,
    {
        cors:{
            origin:"http://localhost:3000",
            credentials:true
        }
    });
const io=new Server(server)
// apply auth
io.use(socketAuthMiddleware);
