// import necessary modules
import express from 'express';
import pg from 'pg';
import { contacts, messages, text, img, searchUsersByEmail } from './controller/messageSQL.js';
import { get_scoket_id, io } from './socket.js';
import { encrypt, decrypt } from './controller/encrypt.js';

// connect to database
const db = new pg.Client({
  connectionString: process.env.Database_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
try{
   
    db.connect();
}catch(err){
    console.log(err);
}



// main
const router = express.Router();

router.get("/contacts/:userId", async (req, res) => {
    try {
        const result = await db.query(contacts, [req.params.userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/messages/:userId1/:userId2", async (req, res) => {
    try {
        const result = await db.query(messages, [
            req.params.userId1,
            req.params.userId2
        ]);

        
        const decrypted = result.rows.map(m => {
            if (m.text && m.text.includes(":")) {
                try {
                    m.text = decrypt(m.text);
                } catch {
                    // old / plain text messages fallback
                }
            }
            return m;
        });

        res.json(decrypted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/searchUsers/:id/:email", async (req, res) => {
    try {
        const result = await db.query(searchUsersByEmail, [
            `%${req.params.email}%`,
            req.params.id
        ]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/text", async (req, res) => {
    const { senderId, receiverId, textt, imgg } = req.body;

    try {
        let result;

        if (textt) {
            
            const encryptedText = encrypt(textt);
            result = await db.query(text, [
                senderId,
                receiverId,
                encryptedText
            ]);
        } 
        else if (imgg) {
            result = await db.query(img, [senderId, receiverId, imgg]);
        }

        const messageData = result.rows[0];

       
        if (messageData.text && messageData.text.includes(":")) {
            try {
                messageData.text = decrypt(messageData.text);
            } catch {}
        }

        if (get_scoket_id(receiverId)) {
            io.to(get_scoket_id(receiverId)).emit("message", messageData);
        }

        res.json(messageData);
    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// export router
export default router;
