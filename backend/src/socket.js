import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import passport from 'passport';
import { sessionMiddleware } from './sessionConfig.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        credentials: true
      }
});

function onlyForHandshake(middleware) {
  return (req, res, next) => {
    const isHandshake = req._query.sid === undefined;
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
}

io.engine.use(onlyForHandshake(sessionMiddleware));
io.engine.use(onlyForHandshake(passport.initialize()));
io.engine.use(onlyForHandshake(passport.session()));
io.engine.use(
  onlyForHandshake((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.writeHead(401);
      res.end();
    }
  }),
);
// check user is live or not
export const get_scoket_id =(userid)=>{
    return userSocketMap[userid];
}
// to store  user
const userSocketMap = {};
const userMap = {};
io.on('connection', (socket) => {
  const user = socket.request.user;
    if (user) {
        userSocketMap[user.id] = socket.id;
        userMap[user.id] = user;
        console.log(`User ${user.email} connected with socket ID ${socket.id}`);
        io.emit('user_connected', { onlineUsers: Object.values(userMap), userSocketMap: userSocketMap });
        socket.on('get_online_users', () => {
            socket.emit('online_users', { onlineUsers: Object.values(userMap) });
        });
        socket.on('disconnect', () => {
            console.log(`User ${user.email} disconnected`);
            delete userSocketMap[user.id];
            delete userMap[user.id];
            io.emit('user_disconnected', { onlineUsers: Object.values(userMap), userSocketMap: userSocketMap });
        });
    } else {
        console.log('Unauthenticated socket connection attempt');
        socket.disconnect();
        return;
    }
});
export {server, io,app};