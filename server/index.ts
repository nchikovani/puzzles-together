import path = require("path");
import bodyParser = require('body-parser');
import express = require("express");
import http = require("http");
import {Server, Socket} from "socket.io";
import {RoomsTypes} from "./server.types";
import registerPuzzleHandlers from './handlers/puzzleHandlers';
import {v4 as uuidv4} from 'uuid';
const port = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server);


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const rooms: RoomsTypes = {'1': {
    puzzle: null,
  }
};

io.on('connection', (socket: Socket & {roomId?: string;}) => {
  console.log('User connected');

  socket.on("room:create", () => {
    const roomId = uuidv4();
    if (!rooms.hasOwnProperty(roomId)) {
      rooms[roomId] = {
        puzzle: null
      };
    }
    socket.emit("room", roomId);
  });

  socket.on("room:join", (roomId: any) => {
    if (rooms.hasOwnProperty(roomId)) {
      socket.roomId  = roomId;
      socket.join(roomId);

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
