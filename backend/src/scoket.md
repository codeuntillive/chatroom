# Socket.IO Backend & Frontend Integration

This document explains **how Socket.IO is integrated with authentication (Passport + Sessions) on the backend and Zustand + React on the frontend**, and how both sides work together end-to-end.

---

## 1. Overall Architecture

```
Browser (React + Zustand)
        ↓
Socket.IO Client (socket.io-client)
        ↓
HTTP Handshake (cookies + session)
        ↓
Socket.IO Server (Express + Passport)
```

Key points:

* One **Express app**
* One **HTTP server**
* One **Socket.IO server**
* Same **session middleware** for HTTP & sockets

This guarantees that **login state is shared everywhere**.

---

## 2. Backend Architecture

### 2.1 Shared Express + Socket Server

```js
const app = express();
const server = http.createServer(app);
const io = new Server(server);
```

Why this matters:

* Cookies sent to Express routes are also sent to Socket.IO
* Sessions and Passport work consistently

---

### 2.2 Session Configuration

```js
export const sessionMiddleware = session({
  secret: 'the secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
});
```

What it does:

* Reads `connect.sid` cookie
* Loads user session
* Makes session available as `req.session`

---

### 2.3 Passport Integration

Used in **Express**:

```js
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
```

Result:

* `req.user` is available on all authenticated HTTP routes

---

## 3. Socket.IO Authentication (Handshake)

### 3.1 What is a Handshake?

Before WebSocket starts, Socket.IO sends an **HTTP request**:

```
GET /socket.io/?EIO=4
Cookie: connect.sid=...
```

Authentication happens **only here**.

---

### 3.2 Handshake-Only Middleware

```js
function onlyForHandshake(middleware) {
  return (req, res, next) => {
    const isHandshake = req._query.sid === undefined;
    if (isHandshake) middleware(req, res, next);
    else next();
  };
}
```

Why this is needed:

* Sessions work only on HTTP requests
* WebSocket packets are not HTTP

---

### 3.3 Socket.IO Middleware Order

```js
io.engine.use(onlyForHandshake(sessionMiddleware));
io.engine.use(onlyForHandshake(passport.initialize()));
io.engine.use(onlyForHandshake(passport.session()));
io.engine.use(
  onlyForHandshake((req, res, next) => {
    if (req.user) next();
    else {
      res.writeHead(401);
      res.end();
    }
  })
);
```

Execution flow:

1. Session loaded from cookie
2. Passport restores user
3. `req.user` checked
4. Socket accepted or rejected

After this:

```js
socket.request.user // authenticated user
```

---

## 4. Backend Socket Logic (Presence System)

### 4.1 User Tracking

```js
const userSocketMap = {};
const userMap = {};
```

Purpose:

* `userSocketMap`: user → socketId
* `userMap`: userId → user object

---

### 4.2 On Connection

```js
io.on('connection', (socket) => {
  const user = socket.request.user;
  userSocketMap[user.id] = socket.id;
  userMap[user.id] = user;
  io.emit('user_connected', { onlineUsers: Object.values(userMap) });
});
```

Effect:

* User marked online
* All clients notified

---

### 4.3 On Disconnect

```js
socket.on('disconnect', () => {
  delete userSocketMap[user.id];
  delete userMap[user.id];
  io.emit('user_disconnected', { onlineUsers: Object.values(userMap) });
});
```

Effect:

* User removed from online list
* Clients update UI instantly

---

## 5. Frontend Architecture (React + Zustand)

### 5.1 Zustand Socket Store

```js
export const useStore = create((set, get) => ({
  user: null,
  socket: null,
  onlineUsers: []
}));
```

Why Zustand:

* Global socket state
* Survives route changes
* Easy real-time updates

---

### 5.2 Connecting the Socket

```js
const socket = io('http://localhost:3000', {
  withCredentials: true
});
```

Why `withCredentials`:

* Sends session cookie
* Enables backend authentication

---

### 5.3 Receiving Events

```js
socket.on('online_users', data => {
  set({ onlineUsers: data.onlineUsers });
});

socket.on('user_connected', data => {
  set({ onlineUsers: data.onlineUsers });
});

socket.on('user_disconnected', data => {
  set({ onlineUsers: data.onlineUsers });
});
```

Effect:

* Zustand updates state
* React re-renders automatically

---

## 6. React App Lifecycle

### 6.1 Restore Login

```js
const res = await axios.get('/api/auth/user', { withCredentials: true });
```

If logged in:

```js
setUser(res.data.user);
connectSocket();
```

---

### 6.2 Route Protection

```jsx
<Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
```

Ensures:

* UI access only for authenticated users

---

## 7. End-to-End Flow Summary

### Login

```
User logs in
→ session created
→ cookie stored
```

### Socket Connect

```
Socket connects
→ cookie sent
→ session loaded
→ passport restores user
→ socket accepted
```

### Presence Updates

```
User connects/disconnects
→ server broadcasts
→ clients update UI
```

---

## 8. Why This Design Is Correct

* Secure (session-based auth)
* Efficient (auth once per connection)
* Scalable (works with Redis / DB stores)
* Production-grade (same as Slack / WhatsApp)

---

## 9. Recommended Improvements

* Use Redis / DB session store
* Prevent multiple sockets per user (or support arrays)
* Disconnect socket on logout
* Handle reconnect logic

---

**This setup represents a clean, professional Socket.IO integration suitable for real
