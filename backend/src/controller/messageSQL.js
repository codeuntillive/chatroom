const contacts="SELECT DISTINCT u.* FROM users u JOIN messages m ON (u.id = m.sender_id AND m.receiver_id = $1) OR (u.id = m.receiver_id AND m.sender_id = $1) WHERE u.id <> $1;";
const messages="SELECT m.id AS message_id, m.text, m.img, m.datetime, m.sender_id, u.fullname AS sender_name, u.email AS sender_email FROM messages m JOIN users u ON u.id = m.sender_id WHERE (m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1) ORDER BY m.datetime";
const text="INSERT INTO messages (sender_id, receiver_id, text) VALUES ($1, $2, $3) RETURNING *;";
const img="INSERT INTO messages (sender_id, receiver_id, img) VALUES ($1, $2, $3) RETURNING *";
const searchUsersByEmail = `SELECT id, fullname, email FROM users WHERE email ILIKE $1 AND id <> $2 ORDER BY email LIMIT 10`;
export { contacts, messages,text,img,searchUsersByEmail };