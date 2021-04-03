import path = require("path");
import bodyParser = require('body-parser');
import express = require("express");
import http = require("http");
import cookieParser = require('cookie-parser');
import {Server, Socket} from "socket.io";
import {RoomTypes, UserTypes} from "./server.types";
import registerPuzzleHandlers from './handlers/puzzleHandlers';
const shortid = require('shortid');
import mongoose = require('mongoose');
import usersRouters from './users/users.routers';
import roomsRouters from './rooms/rooms.routers';
const port = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server);

app.use('/users', usersRouters);
app.use('/rooms', roomsRouters);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});
//
// io.on('connection', (socket: Socket & {roomId?: string; room?: RoomTypes;}) => {
//   console.log('User connected to webSocket');
//
//   socket.on("room:join", (roomId: any) => {
//     const joinRoom = rooms.find(room => room.id === roomId);
//     if (joinRoom) {
//       socket.roomId  = roomId;
//       socket.room = joinRoom;
//       socket.join(roomId);
//
//       const puzzle = joinRoom.puzzle;
//       puzzle && socket.emit("puzzle", puzzle.getGameData());
//     } else {
//       socket.emit("room:notFound");
//     }
//   });
//
//
//   registerPuzzleHandlers(io, socket);
//
//   socket.on('disconnect', () => {
//     console.log('User disconnected from webSocket');
//     socket.roomId && socket.leave(socket.roomId);
//   })
// });

const uri = "mongodb+srv://admin:admin@cluster0.vr7at.mongodb.net/puzzles-together?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true}, function(err){
  if(err) return console.log(err);
  server.listen(port, () => {
    console.log("Сервер ожидает подключения...");
  });
});
