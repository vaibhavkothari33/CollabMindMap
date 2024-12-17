import "./addRequire.js"
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', 
        credentials: true,
        optionSuccessStatus: 200,
        methods: ["GET", "POST"],
    },

});

let nodes = [];
let edges = [];

io.on('connection', (socket) => {
    console.log("User Connected", socket.id);

    socket.emit('initial_data', { nodes, edges });

    socket.on('update_nodes', (updatedNodes) => {
        nodes = updatedNodes;
        socket.broadcast.emit('node_updated', updatedNodes);
    });

    socket.on('update_edges', (updateEdges) => {
        edges = updateEdges;
        socket.broadcast.emit('edges_updated', updateEdges);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Socket.IO server running at port : ${PORT}`);

});
