import {Server} from "socket.io";
import Puzzle from "../utils/Puzzle";
import RoomsService from '../rooms/rooms.service';
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {SocketObject} from "../server.types";
import * as webSocketServerActions from 'shared/webSocketServerActions';
import * as webSocketActionsTypes from 'shared/webSocketActionsTypes';
import {WebSocketClientActionsTypes} from 'shared';
import MyError from '../utils/Error';
const {gameDataAction, optionsAction, updateAction, errorAction, solvedAction} = webSocketServerActions;

interface activeRoomTypes {
  _id: string;
  owner: string;
  puzzleData: string | null;
  puzzle: Puzzle | null;

}

class SocketService {
  io: Server<DefaultEventsMap, DefaultEventsMap>;
  activeRooms: activeRoomTypes[] = [];

  constructor(io: Server<DefaultEventsMap, DefaultEventsMap>) {
    this.io = io;

    this.roomRouters = this.roomRouters.bind(this);
    this.puzzleRouters = this.puzzleRouters.bind(this);
  }

  registerListener() {
    const {io} = this;
    io.on('connection', (socket: SocketObject) => {
      console.log('User connected to webSocket');

      socket.on("room", async (action) => this.handleError(action, socket, this.roomRouters));
      socket.on("puzzle", (action) => this.handleError(action, socket, this.puzzleRouters));

      socket.on('disconnect', () => {
        if (socket.roomId) {
          const clients = io.sockets.adapter.rooms.get(socket.roomId);
          if (!clients) {//Сохранять пазл и...
            this.activeRooms = this.activeRooms.filter(room => room._id != socket.roomId);
          }
        }
        socket.roomId && socket.leave(socket.roomId);
        console.log('User disconnected from webSocket');
      })
    });
  }

  async handleError(action: WebSocketClientActionsTypes, socket: SocketObject, router: (action: WebSocketClientActionsTypes, socket: SocketObject) => void) {
    try {
      await router(action, socket);
    } catch (error: unknown) {
      if (error instanceof MyError) {
        socket.emit('puzzle', errorAction(error.code, error.message)); //ev может быть и другим
      } else if (error instanceof Error) {
        socket.emit('puzzle', errorAction(500, error.message));
      } else {
        socket.emit('puzzle', errorAction(500, 'Server Error'));
      }
    }
  }

  async roomRouters(action: WebSocketClientActionsTypes, socket: SocketObject) {
    switch (action.type) {
      case webSocketActionsTypes.JOIN: {
        let joinRoom: activeRoomTypes;
        const activeRoom = this.activeRooms.find(activeRoom => activeRoom._id == action.roomId);
        if (activeRoom) {
          joinRoom = activeRoom;
          const puzzle = joinRoom.puzzle;
          if (puzzle) {
            const gameData = puzzle.getGameData();
            socket.emit("puzzle", gameDataAction(gameData));
          }
        } else {
          const room = await RoomsService.getRoomById(action.roomId);
          if (!room) throw new MyError(404, 'Room not found.');
          joinRoom = {
            _id: String(room._id),
            owner: String(room.owner),
            puzzleData: room.puzzleData || null,
            puzzle: null,
          };
          const jsonPuzzleData = joinRoom.puzzleData;
          if (jsonPuzzleData) {
            const puzzle = new Puzzle();
            puzzle.createPuzzleFromJson(jsonPuzzleData);
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

  puzzleRouters(action: WebSocketClientActionsTypes, socket: SocketObject) {
    const {io} = this;
    switch (action.type) {
      case webSocketActionsTypes.GET_OPTIONS: {//проверять токен  //берет опции и создает новый объект пазла
        const roomId = socket.roomId;
        if (!roomId) throw new MyError(400, 'Did not join the room.');
        const room = this.activeRooms.find(activeRoom => activeRoom._id == roomId);
        if (!room) throw new MyError(404, 'Room not found.');
        const newPuzzle = new Puzzle();
        newPuzzle.init(action.image);
        room.puzzle = newPuzzle;
        socket.emit("puzzle", optionsAction(newPuzzle.options));
        break;
      }
      case webSocketActionsTypes.CREATE: {//проверять токен
        const roomId = socket.roomId;
        if (!roomId) throw new MyError(400, 'Did not join the room.');
        const room = this.activeRooms.find(activeRoom => activeRoom._id == roomId);
        if (!room) throw new MyError(404, 'Room not found.');
        if (!room.puzzle) throw new MyError(400, 'Puzzle not created.');
        room.puzzle.createPuzzle(action.optionId);
        const gameData = room.puzzle.getGameData();
        socket.emit("puzzle", gameDataAction(gameData));
        break;
      }
      case webSocketActionsTypes.SET_UPDATE: {
        const roomId = socket.roomId;
        if (!roomId) throw new MyError(400, 'Did not join the room.');
        const room = this.activeRooms.find(activeRoom => activeRoom._id == roomId);
        if (!room) throw new MyError(404, 'Room not found.');
        if (!room.puzzle) throw new MyError(400, 'Puzzle not created.');
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