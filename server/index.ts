
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const players = {};

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  players[socket.id] = { x: 0, y: 0 };

  socket.emit('init', players);

  socket.on('move', (data) => {
    players[socket.id] = data;
    io.emit('state', players);
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('state', players);
    console.log('Player disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
