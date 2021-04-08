import {Server} from "socket.io";
import Puzzle from "../utils/Puzzle";
import RoomsService from '../rooms/rooms.service';
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {SocketObject} from "../server.types";
import * as webSocketServerActions from 'shared/webSocketServerActions';
import * as webSocketActionsTypes from 'shared/webSocketActionsTypes';
import {WebSocketClientActionsTypes} from 'shared';
import AppError from '../utils/AppError';
import * as fs from "fs";
const {gameDataAction, optionsAction, updateAction, errorAction, solvedAction} = webSocketServerActions;
import config from '../config';

interface ActiveRoomTypes {
  _id: string;
  owner: string;
  puzzle: Puzzle | null;
  isDisconnecting?: boolean;
}

class SocketService {
  io: Server<DefaultEventsMap, DefaultEventsMap>;
  activeRooms: ActiveRoomTypes[] = [];

  constructor(io: Server<DefaultEventsMap, DefaultEventsMap>) {
    this.io = io;

    this.roomRouters = this.roomRouters.bind(this);
    this.puzzleRouters = this.puzzleRouters.bind(this);
    this.disconnectHandler = this.disconnectHandler.bind(this);
  }

  registerListener() {
    const {io} = this;
    io.on('connection', (socket: SocketObject) => {
      console.log('User connected to webSocket');

      socket.on("room", (action) => this.handleError(action, socket, this.roomRouters));
      socket.on("puzzle", (action) => this.handleError(action, socket, this.puzzleRouters));
      socket.on('disconnect', async () => {
        try {
          await this.disconnectHandler(socket)
        } catch (error) {
          console.log(error);
          if (error instanceof AppError) {
            socket.emit('puzzle', errorAction(error.code, error.message)); //ev может быть и другим
          } else if (error instanceof Error) {
            socket.emit('puzzle', errorAction(500, error.message));
          } else {
            socket.emit('puzzle', errorAction(500, 'Server Error'));
          }
        } finally {
          this.activeRooms = this.activeRooms.filter(room => room._id != socket.roomId);
        }
      });
    });
  }
  async handleError(action: WebSocketClientActionsTypes, socket: SocketObject, router: (socket: SocketObject, action: WebSocketClientActionsTypes) => void) {
    try {
      // @ts-ignore
      await router(socket, action);
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof AppError) {
        socket.emit('puzzle', errorAction(error.code, error.message)); //ev может быть и другим
      } else if (error instanceof Error) {
        socket.emit('puzzle', errorAction(500, error.message));
      } else {
        socket.emit('puzzle', errorAction(500, 'Server Error'));
      }
    }
  }

  async disconnectHandler(socket: SocketObject) {
    console.log('User disconnected from webSocket');
    if (socket.roomId) {
      const clients = this.io.sockets.adapter.rooms.get(socket.roomId);
      socket.leave(socket.roomId);
      if (!clients) {
        const activeRoom = this.activeRooms.find(room => room._id == socket.roomId);
        if (activeRoom) {
          const puzzle = activeRoom.puzzle;
          activeRoom.isDisconnecting = true
          if (puzzle) {
            const jsonPuzzle = puzzle.getJsonPuzzle();
            fs.writeFileSync(`${config.roomJsonPuzzlePath}${socket.roomId}.json`, jsonPuzzle, {encoding: 'utf8'});
          }
        }
      }
    }
  }

  async roomRouters(socket: SocketObject, action: WebSocketClientActionsTypes) {
    switch (action.type) {
      case webSocketActionsTypes.JOIN: {
        await RoomsService.updateLastVisit(action.roomId);
        let joinRoom: ActiveRoomTypes;
        const activeRoom = this.activeRooms.find(activeRoom => activeRoom._id == action.roomId);
        if (activeRoom) {
          if (activeRoom.isDisconnecting) throw new AppError(500, 'The last room changes have not been saved yet.');
          joinRoom = activeRoom;
          const puzzle = joinRoom.puzzle;
          if (puzzle) {
            const gameData = puzzle.getGameData();
            socket.emit("puzzle", gameDataAction(gameData));
          }
        } else {
          const room = await RoomsService.getRoomById(action.roomId);
          if (!room) throw new AppError(404, 'Room not found.');
          joinRoom = {
            _id: String(room._id),
            owner: String(room.owner),
            puzzle: null,
          };
          if (fs.existsSync(`${config.roomJsonPuzzlePath}${room._id}.json`)) {
            const jsonPuzzle = fs.readFileSync(`${config.roomJsonPuzzlePath}${room._id}.json`, {encoding: 'utf8'});
            const puzzle = new Puzzle();

            puzzle.createPuzzleFromJson(jsonPuzzle);
            if (puzzle.puzzleIsCreated) {
              const gameData = puzzle.getGameData();
              socket.emit("puzzle", gameDataAction(gameData));
            }else if (puzzle.isInit) {// пока else
              socket.emit("puzzle", optionsAction(puzzle.options));
            }

            joinRoom.puzzle = puzzle;
          }
          this.activeRooms.push(joinRoom);
        }
        socket.roomId = action.roomId;
        socket.join(action.roomId);
        break;
      }
    }
  }

  puzzleRouters(socket: SocketObject, action: WebSocketClientActionsTypes) {
    const {io} = this;
    switch (action.type) {
      case webSocketActionsTypes.GET_OPTIONS: {//проверять токен  //берет опции и СОЗДАЕТ НОВЫЙ ОБЪЕКТ ПАЗЛА
        const roomId = socket.roomId;
        if (!roomId) throw new AppError(400, 'Did not join the room.');
        const room = this.activeRooms.find(activeRoom => activeRoom._id == roomId);
        if (!room) throw new AppError(404, 'Room not found.');
        const newPuzzle = new Puzzle();
        newPuzzle.init(action.image);
        room.puzzle = newPuzzle;
        socket.emit("puzzle", optionsAction(newPuzzle.options));
        break;
      }
      case webSocketActionsTypes.CREATE: {//проверять токен
        const roomId = socket.roomId;
        if (!roomId) throw new AppError(400, 'Did not join the room.');
        const room = this.activeRooms.find(activeRoom => activeRoom._id == roomId);
        if (!room) throw new AppError(404, 'Room not found.');
        if (!room.puzzle) throw new AppError(400, 'Puzzle not created.');
        room.puzzle.createPuzzle(action.optionId);
        const gameData = room.puzzle.getGameData();
        socket.emit("puzzle", gameDataAction(gameData));
        break;
      }
      case webSocketActionsTypes.SET_UPDATE: {
        const roomId = socket.roomId;
        if (!roomId) throw new AppError(400, 'Did not join the room.');
        const room = this.activeRooms.find(activeRoom => activeRoom._id == roomId);
        if (!room) throw new AppError(404, 'Room not found.');
        if (!room.puzzle) throw new AppError(400, 'Puzzle not created.');
        const beforeIsSolved = room.puzzle.isSolved;
        room.puzzle.update(action.update);
        socket.broadcast.to(roomId).emit("puzzle", updateAction(action.update));
        if (!beforeIsSolved && room.puzzle.isSolved) {
          io.to(roomId).emit("puzzle", solvedAction());
        }
        break;
      }
    }
  }
}

export default SocketService;