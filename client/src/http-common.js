import axios from "axios";

const SERVER_PORT = 8000;

export default axios.create({
  baseURL: `http://localhost:${SERVER_PORT}/api`,
  headers: {
    "Content-type": "application/json",
  },
});