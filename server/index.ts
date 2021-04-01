import path = require("path");
import bodyParser = require('body-parser');
import express = require("express");
import http = require("http");
import * as jwt from 'jwt-simple';
import {Server, Socket} from "socket.io";
import {RoomTypes} from "./server.types";
import registerPuzzleHandlers from './handlers/puzzleHandlers';
import {v4 as uuidv4} from 'uuid';
const port = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server);

interface UserTypes {
  id: string;
  roomsId: string[];
}

const rooms: RoomTypes[] = [{
  id: '1',
  name: 'name',
  puzzle: null,
}];

const users: UserTypes[] = [{
  id: '1',
  roomsId: [],
}];

app.post("/user", (req, res) => {
  const user_id = uuidv4();
  const token = jwt.encode(user_id, 'secret');
  const user = {
    id: user_id,
    roomsId: [],
  };
  users.push(user);
  res.json({token})
});

app.get("/rooms", (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  const user_id= jwt.decode(token, 'secret')
  const user = users.find(user => user.id === user_id);

  if (!user) return res.json({error: 'Ошибочка'});

  const userRooms = user.roomsId.map(roomId => rooms.find(room => room.id === roomId));
  //чутка другая инфа нужна
  res.json({rooms: userRooms});
});

app.post('/room', (req, res) => {
  const {name} = req.body;
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  const user_id = jwt.decode(token, 'secret');
  const user = users.find(user => user.id === user_id);

  if (!user) {
    res.json({error: 'Ошибочка'});
    return;
  }

  const roomId = uuidv4();
  rooms.push({
    id: roomId,
    name,
    puzzle: null
  });

  user.roomsId.push(roomId);
  const userRooms = user.roomsId.map(roomId => rooms.find(room => room.id === roomId));

  res.json({rooms: userRooms});
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


io.on('connection', (socket: Socket & {roomId?: string; room?: RoomTypes;}) => {
  console.log('User connected');

  // socket.on("room:create", (token) => {
  //   const roomId = uuidv4();
  //   if (!rooms.hasOwnProperty(roomId)) {
  //     rooms[roomId] = {
  //       puzzle: null
  //     };
  //   }
  //   socket.emit("room", roomId);
  // });

  socket.on("room:join", (roomId: any) => {
    const joinRoom = rooms.find(room => room.id === roomId);
    if (joinRoom) {
      socket.roomId  = roomId;
      socket.room = joinRoom;
      socket.join(roomId);

      const puzzle = joinRoom.puzzle;
      puzzle && socket.emit("puzzle", puzzle.getGameData());
    } else {
      socket.emit("room:notFound");
    }
  });

  registerPuzzleHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.roomId && socket.leave(socket.roomId);
  })
});

server.listen(port, () => {
  console.log("Сервер ожидает подключения...");
});
