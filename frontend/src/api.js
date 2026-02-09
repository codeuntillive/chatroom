import axios from "axios";

const BASE_URL = import.meta.env.PROD
  ? "https://chatroom-z517.onrender.com"
  : "http://localhost:3000";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true
});

export const SOCKET_URL = BASE_URL;
export default API;
