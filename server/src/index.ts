import path = require("path");
import bodyParser = require('body-parser');
import express = require("express");
import http = require("http");
import cookieParser = require('cookie-parser');
import {Server} from "socket.io";
import mongoose = require('mongoose');
import usersRouters from './users/users.routers';
import roomsRouters from './rooms/rooms.routers';
import SocketService from "./service/SocketService";
import errorHandler from "./middleware/errorHandler";
import {checkToken} from "./middleware/checkToken";
import cron = require('node-cron');
import {deletingExpiredRooms} from './utils/deletingExpiredRooms';
import config from './config';

const app = express();
app.use(express.static(config.staticPath));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: config.socketBufferSize,
});

app.use('/users', usersRouters);
app.use('/rooms', checkToken, roomsRouters);
app.use(errorHandler);

app.get("*", (req, res) => {
  res.sendFile(path.join(config.staticPath, 'index.html'));
});

new SocketService(io);

cron.schedule('39 13 * * *', deletingExpiredRooms);

mongoose.connect(config.mongoDbUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, function(err){
  if(err) return console.log(err);
  server.listen(config.port, () => {
    console.log("Сервер ожидает подключения...");
  });
});
