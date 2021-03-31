const path = require("path");
const bodyParser = require('body-parser');
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const registerPuzzleHandlers = require('./handlers/puzzleHandlers');
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.json({limit: '10mb', extended: true}));

const server = http.createServer(app);
const io = socketIo(server);
// @ts-ignore
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


const rooms = {1: {// @ts-ignore
  puzzle: null,
  }};
// @ts-ignore
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on("room:create", () => {
    const roomId = uuidv4();
    if (!rooms.hasOwnProperty(roomId)) {
      // @ts-ignore
      rooms[roomId] = {
        puzzle: null
      };
    }
    socket.emit("room", roomId);
  });
  // @ts-ignore
  socket.on("room:join", (roomId) => {
    if (rooms.hasOwnProperty(roomId)) {
      socket.roomId = roomId;
      socket.join(roomId);
      // @ts-ignore
      const puzzle = rooms[roomId].puzzle;
      puzzle && socket.emit("puzzle", puzzle.getGameData());
    } else {
      socket.emit("room:notFound");
    }
  });

  registerPuzzleHandlers(io, socket, rooms);

  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.roomId && socket.leave(socket.roomId);
  })
});

server.listen(port, () => {
  console.log("Сервер ожидает подключения...");
});
