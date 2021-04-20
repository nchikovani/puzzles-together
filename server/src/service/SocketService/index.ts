import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {SocketObject} from "./SocketService.types";
import ActivePuzzlesService from './ActivePuzzlesService';
import * as webSocketServerActions from 'shared/webSocketServerActions';
import {WebSocketClientActionsType} from 'shared';
import {ServerError, serverErrorMessages} from 'shared';
import * as fs from "fs";
import config from '../../config';
import roomRouters from './roomRouters';
import puzzleRouters from './puzzleRouters';
const {errorAction} = webSocketServerActions;
import jwt = require("jsonwebtoken");
const cookieParser = require('socket.io-cookie-parser');

class SocketService {
  readonly io: Server<DefaultEventsMap, DefaultEventsMap>;
  readonly activePuzzlesService: ActivePuzzlesService;

  constructor(io: Server<DefaultEventsMap, DefaultEventsMap>) {
    this.io = io;
    this.activePuzzlesService = new ActivePuzzlesService();

    this.disconnectHandler = this.disconnectHandler.bind(this);
    io.use(cookieParser());
    io.use(this.authenticationHandler);

    io.on('connection', (socket: SocketObject) => {
      console.log('User connected to webSocket');

      socket.on("room", (action) => this.asyncMiddleware(roomRouters)(action, socket));
      socket.on("puzzle", (action) => this.asyncMiddleware(puzzleRouters)(action, socket));

      socket.on('disconnect', async () => {
        console.log('User disconnected from webSocket');
        try {
          this.disconnectHandler(socket)
        } catch (error) {
          this.errorHandler(error, socket);
        }
      });
    });
  }

  private authenticationHandler(socket: SocketObject, next: any) {
    if (!socket.request.cookies) return next(new Error(serverErrorMessages.invalidToken));
    const token = socket.request.cookies['token'];
    jwt.verify(token, config.tokenKey, (err: any, data: any) => {
      if (err) {
        return next(new Error(serverErrorMessages.invalidToken));
      } else if (data.id) {
        socket.userId = data.id;
        next();
      }
    });
  }

  private disconnectHandler(socket: SocketObject) {
    if (socket.roomId) {
      const clients = this.io.sockets.adapter.rooms.get(socket.roomId);
      socket.leave(socket.roomId);
      if (!clients) {
        const activePuzzle = this.activePuzzlesService.findPuzzle(socket.roomId);
        this.activePuzzlesService.removePuzzle(socket.roomId);
        if (activePuzzle && activePuzzle.puzzleIsCreated) {
          const jsonPuzzle = activePuzzle.getJsonPuzzle();
          fs.writeFileSync(`${config.roomJsonPuzzlePath}${socket.roomId}.json`, jsonPuzzle, {encoding: 'utf8'});
        }
      }
    }
  }

  private asyncMiddleware (fn: (action: WebSocketClientActionsType, io: Server<DefaultEventsMap, DefaultEventsMap>,  socket: SocketObject, activeRoomsService: ActivePuzzlesService) => void) {
    return async (action: WebSocketClientActionsType, socket: SocketObject) => {
      try {
        await fn(action, this.io, socket, this.activePuzzlesService);
      } catch (error) {
        this.errorHandler(error, socket)
      }
    };
  }

  private errorHandler(error: unknown, socket: SocketObject) {
    console.log(error);
    if (error instanceof ServerError) {
      socket.emit('puzzle', errorAction(error.code, error.message)); //ev может быть и другим
    } else if (error instanceof Error) {
      socket.emit('puzzle', errorAction(500, error.message));
    } else {
      socket.emit('puzzle', errorAction(500, serverErrorMessages.serverError));
    }
  }
}

export default SocketService;