import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("add-node", (newNode) => {
    socket.to(newNode.roomId).emit("node-added", newNode);
  });

  socket.on("add-edge", (newEdge) => {
    socket.to(newEdge.roomId).emit("edge-added", newEdge);
  });

  socket.on("update-node", (updatedNode) => {
    socket.to(updatedNode.roomId).emit("node-updated", updatedNode);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});