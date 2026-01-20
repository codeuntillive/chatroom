import crypto from "crypto";

const algorithm = "aes-256-cbc";

// Convert secret to 32 bytes key
const key = crypto
  .createHash("sha256")
  .update(process.env.MESSAGE_SECRET)
  .digest();

export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // store iv + encrypted text together
  return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
