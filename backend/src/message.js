// import necessary modules
import express from 'express';
import pg from 'pg';
import { contacts,messages,text,img,searchUsersByEmail } from './controller/messageSQL.js';

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
// main
const router = express.Router();
router.get("/contacts/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const result = await db.query(contacts, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/messages/:userId1/:userId2", async (req, res) => {
    const { userId1, userId2 } = req.params;
    try {
        const result = await db.query(messages, [userId1, userId2]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.get("/searchUsers/:email", async (req, res) => {
    const email = `%${req.params.email}%`;
    try {
        const result = await db.query(searchUsersByEmail, [email]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.post("/text", async (req, res) => {
    const { senderId, receiverId, textt, imgg } = req.body;
    try {
        let result;
        if (textt) {
            result = await db.query(text, [senderId, receiverId, textt]);
        } else if (imgg) {
            result = await db.query(img, [senderId, receiverId, imgg]);
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// export router
export default router;