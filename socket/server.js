const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store room state
const rooms = new Map();
const roomUsers = new Map();

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, userId, userName, userColor }) => {
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { nodes: [], edges: [] });
    }
    
    // Track users in room
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Map());
    }
    roomUsers.get(roomId).set(userId, { 
      userName, 
      socketId: socket.id,
      userColor 
    });
    
    // Send current room state
    socket.emit('room-state', rooms.get(roomId));
    
    // Broadcast user count
    io.to(roomId).emit('live-users', roomUsers.get(roomId).size);
  });

  socket.on('cursor-move', ({ roomId, userId, position, userName, userColor }) => {
    socket.to(roomId).emit('cursor-moved', { 
      userId, 
      position, 
      userName,
      userColor 
    });
  });

  socket.on('add-node', ({ roomId, node }) => {
    const roomState = rooms.get(roomId);
    if (roomState) {
      roomState.nodes.push(node);
      socket.to(roomId).emit('node-added', node);
    }
  });

  socket.on('update-node', ({ roomId, node }) => {
    const roomState = rooms.get(roomId);
    if (roomState) {
      roomState.nodes = roomState.nodes.map(n => 
        n.id === node.id ? node : n
      );
      socket.to(roomId).emit('node-updated', node);
    }
  });

  socket.on('add-edge', ({ roomId, edge }) => {
    const roomState = rooms.get(roomId);
    if (roomState) {
      roomState.edges.push(edge);
      socket.to(roomId).emit('edge-added', edge);
    }
  });

  socket.on('leave-room', ({ roomId, userId }) => {
    if (roomUsers.has(roomId)) {
      roomUsers.get(roomId).delete(userId);
      
      if (roomUsers.get(roomId).size === 0) {
        rooms.delete(roomId);
        roomUsers.delete(roomId);
      } else {
        io.to(roomId).emit('live-users', roomUsers.get(roomId).size);
      }
    }
    socket.leave(roomId);
  });

  socket.on('disconnect', () => {
    roomUsers.forEach((users, roomId) => {
      users.forEach((user, userId) => {
        if (user.socketId === socket.id) {
          users.delete(userId);
          io.to(roomId).emit('live-users', users.size);
        }
      });
    });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});