import express from 'express';
import { Server } from 'socket.io';
import http from 'http';




const app = express();
const PORT = 5173;
const server=http.createServer(app);
const io=new Server(server);

app.use(express.static('public'));

// socket.io connection
io.on('connection',(socket)=>{
    socket.on('chat-message',(msg)=>{
        console.log(msg);
        io.emit('chat-message',msg);
    })
});


app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});