import path = require("path");
import bodyParser = require('body-parser');
import express = require("express");
import http = require("http");
import * as jwt from 'jwt-simple';
import {Server, Socket} from "socket.io";
import {RoomTypes} from "./server.types";
import registerPuzzleHandlers from './handlers/puzzleHandlers';
const shortid = require('shortid');
const port = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server);

interface UserTypes {
  id: string;
  registered: boolean;
  roomsId: string[];
}

const rooms: RoomTypes[] = [{
  id: '1',
  name: 'name',
  puzzle: null,
}];

const users: UserTypes[] = [{
  id: '1',
  registered: false,
  roomsId: [],
}];

app.get("/user", (req, res) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  let user: UserTypes;

  const createUser = () => {
    const id = shortid.generate();
    user = {
      id: id,
      registered: false,
      roomsId: [],
    };
    token = jwt.encode(id, 'secret');
    users.push(user);
  };


  if (!token) {
    createUser();
  } else {
    const user_id = jwt.decode(token, 'secret');
    const userFind = users.find(user => user.id === user_id);
    if (!userFind) {
      createUser();
    } else {
      user = userFind;
    }
  }
  // @ts-ignore
  res.json({token, id: user.id, registered: user.registered})
});


app.post("/getPersonalArea", (req, res) => {
  const {userId} = req.body;
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  const userIdFromToken = jwt.decode(token, 'secret');

  const user = users.find(user => user.id === userId);
  if (!user) return res.status(404).json({error: 'Ошибочка, пользователь не найден'});

  if (userId !== userIdFromToken) return res.status(200).json({rooms: [], isOwner: false});

  const userRooms: any[] = [];
  user.roomsId.forEach(roomId => {
    const targetRoom = rooms.find(room => room.id === roomId)
    if (!targetRoom) return;
    userRooms.push({
      id: targetRoom.id,
      name: targetRoom.name,
    });
  });
  res.status(200).json({rooms: userRooms, isOwner: true});
});

app.post('/addRoom', (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  const user_id = jwt.decode(token, 'secret');
  const user = users.find(user => user.id === user_id);

  if (!user) {
    res.json({error: 'Ошибочка'});
    return;
  }

  const roomId = shortid.generate();

  rooms.push({
    id: roomId,
    name: roomId,
    puzzle: null
  });

  user.roomsId.push(roomId);

  res.json({room: {id: roomId, name: roomId}});
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

io.on('connection', (socket: Socket & {roomId?: string; room?: RoomTypes;}) => {
  console.log('User connected to webSocket');

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
    console.log('User disconnected from webSocket');
    socket.roomId && socket.leave(socket.roomId);
  })
});

server.listen(port, () => {
  console.log("Сервер ожидает подключения...");
});
