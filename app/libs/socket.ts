import { io } from "socket.io-client";

// Define the server URL (for local development or production)
const socket = io({
  path: "/api/socket", // Socket.IO endpoint
});

export default socket;
