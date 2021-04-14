import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {SocketObject} from "./SocketService.types";
import ActiveRoomsService from './ActiveRoomsService';
import * as webSocketServerActions from 'shared/webSocketServerActions';
import {WebSocketClientActionsType} from 'shared';
import {ServerError, serverErrorMessages} from 'shared';
import * as fs from "fs";
import config from '../../config';
import roomRouters from './roomRouters';
import puzzleRouters from './puzzleRouters';
const {errorAction} = webSocketServerActions;

class SocketService {
  readonly io: Server<DefaultEventsMap, DefaultEventsMap>;
  readonly activeRoomsService: ActiveRoomsService;

  constructor(io: Server<DefaultEventsMap, DefaultEventsMap>) {
    this.io = io;
    this.activeRoomsService = new ActiveRoomsService();

    this.disconnectHandler = this.disconnectHandler.bind(this);

    io.on('connection', (socket: SocketObject) => {
      console.log('User connected to webSocket');

      socket.on("room", (action) => this.asyncMiddleware(roomRouters)(action, socket));
      socket.on("puzzle", (action) => this.asyncMiddleware(puzzleRouters)(action, socket));

      socket.on('disconnect', async () => {
        console.log('User disconnected from webSocket');
        try {
          await this.disconnectHandler(socket)
        } catch (error) {
          this.errorHandler(error, socket);
        }
      });
    });
  }

  private async disconnectHandler(socket: SocketObject) {
    if (socket.roomId) {
      const clients = this.io.sockets.adapter.rooms.get(socket.roomId);
      socket.leave(socket.roomId);
      if (!clients) {
        const activeRoom = this.activeRoomsService.findRoom(socket.roomId);
        this.activeRoomsService.removeRoom(socket.roomId);
        if (activeRoom) {
          const puzzle = activeRoom.puzzle;
          if (puzzle && puzzle.puzzleIsCreated) {
            const jsonPuzzle = puzzle.getJsonPuzzle();
            fs.writeFileSync(`${config.roomJsonPuzzlePath}${socket.roomId}.json`, jsonPuzzle, {encoding: 'utf8'});
          }
        }
      }
    }
  }

  private asyncMiddleware (fn: (action: WebSocketClientActionsType, io: Server<DefaultEventsMap, DefaultEventsMap>,  socket: SocketObject, activeRoomsService: ActiveRoomsService) => void) {
    return async (action: WebSocketClientActionsType, socket: SocketObject) => {
      try {
        await fn(action, this.io, socket, this.activeRoomsService);
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