import {Server} from "socket.io";
import Puzzle from "../utils/Puzzle";
import RoomsService from '../rooms/rooms.service';
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {SocketObject} from "../server.types";
import * as webSocketServerActions from 'shared/webSocketServerActions';
import * as webSocketActionsTypes from 'shared/webSocketActionsTypes';
import {WebSocketClientActionsTypes} from 'shared';
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

    this.roomHandlers = this.roomHandlers.bind(this);
    this.puzzleHandlers = this.puzzleHandlers.bind(this);
  }

  registerListener() {
    const {io} = this;
    io.on('connection', (socket: SocketObject) => {
      console.log('User connected to webSocket');
      socket.on("room", (action) => this.roomHandlers(action, socket));
      socket.on("puzzle", (action) => this.puzzleHandlers(action, socket));

      socket.on('disconnect', () => {
        if (socket.roomId) {
          const clients = io.sockets.adapter.rooms.get(socket.roomId);
          if (!clients) {
            this.activeRooms = this.activeRooms.filter(room => room._id != socket.roomId);
          }
        }
        socket.roomId && socket.leave(socket.roomId);
        console.log('User disconnected from webSocket');
      })
    });
  }

  async roomHandlers(action: WebSocketClientActionsTypes, socket: SocketObject) {
    switch (action.type) {
      case webSocketActionsTypes.JOIN: {
        let joinRoom: activeRoomTypes;
        const activeRoom = this.activeRooms.find(activeRoom => activeRoom._id == action.roomId);
        if (activeRoom) {
          joinRoom = activeRoom;
          const puzzle = joinRoom.puzzle;
          const gameData = puzzle && puzzle.getGameData();
          if (gameData) {
            socket.emit("puzzle", gameDataAction(gameData));
          }
        } else {
          const room = await RoomsService.getRoomById(action.roomId);
          if (room !== undefined) {
            if (room) {
              joinRoom = {
                _id: String(room._id),
                owner: String(room.owner),
                puzzleData: room.puzzleData || null,
                puzzle: null,
              };
              const jsonPuzzleData = joinRoom.puzzleData;
              if (jsonPuzzleData) {
                let puzzleData;
                try {
                  puzzleData = JSON.parse(jsonPuzzleData);
                  joinRoom.puzzle = new Puzzle(puzzleData.image);
                  joinRoom.puzzle.init(puzzleData);
                } catch (e) {
                  return socket.emit("room", errorAction(4, ''));//какая-то ошибка тут
                }
              }
              this.activeRooms.push(joinRoom);
            } else {
              return socket.emit("puzzle", errorAction(404, 'Room not found.'));
            }
          } else {
            return socket.emit("puzzle", errorAction(500, 'Unable find room.'));
          }
        }
        socket.roomId = action.roomId;
        console.log(action.roomId);
        socket.join(action.roomId);
        break;
      }
    }
  }

  puzzleHandlers(action: WebSocketClientActionsTypes, socket: SocketObject) {
    const {io} = this;
    switch (action.type) {
      case webSocketActionsTypes.GET_OPTIONS: {//проверять токен
        const roomId = socket.roomId;
        if (roomId) {
          const room = this.activeRooms.find(activeRoom => activeRoom._id == roomId);
          if (room) {
            const newPuzzle = new Puzzle(action.image);
            room.puzzle = newPuzzle;
            const options = newPuzzle.getPartsCountOptions();
            //если что, отправлять ошибку, проверять входящие данные??
            socket.emit("puzzle", optionsAction(options));
          } else {
            return socket.emit("puzzle", errorAction(404, 'Room not found.'));
          }
        } else {
          return socket.emit("puzzle", errorAction(4, ''));//какая-то ошибка тут
        }
        break;
      }
      case webSocketActionsTypes.CREATE: {//проверять токен
        const roomId = socket.roomId;
        if (roomId) {
          const room = this.activeRooms.find(activeRoom => activeRoom._id === roomId)
          if (room) {
            if (room.puzzle) {
              room.puzzle.createPuzzle(action.option);
              const gameData = room.puzzle.getGameData();
              //если что, отправлять ошибку, проверять входящие данные??
              // @ts-ignore
              socket.emit("puzzle", gameDataAction(gameData));
            } else {
              return socket.emit("puzzle", errorAction(4, ''));//какая-то ошибка тут
            }
          } else {
            return socket.emit("puzzle", errorAction(404, 'Room not found.'));
          }
        } else {
          return socket.emit("puzzle", errorAction(4, ''));//какая-то ошибка тут
        }
        break;
      }
      case webSocketActionsTypes.SET_UPDATE: {
        const roomId = socket.roomId;
        if (roomId) {
          const room = this.activeRooms.find(activeRoom => activeRoom._id === roomId)
          if (room) {
            if (room.puzzle) {
              //if room.puzzle.init  else
              const beforeIsSolved = room.puzzle.isSolved;
              room.puzzle.update(action.update);
              //если что, отправлять ошибку, проверять входящие данные??
              socket.broadcast.to(roomId).emit("puzzle", updateAction(action.update));
              if (!beforeIsSolved && room.puzzle.isSolved) {
                io.to(roomId).emit("puzzle", solvedAction());
              }
            } else {
              return socket.emit("puzzle", errorAction(4, ''));//какая-то ошибка тут
            }
          } else {
            return socket.emit("puzzle", errorAction(404, 'Room not found.'));
          }
        } else {
          return socket.emit("puzzle", errorAction(4, ''));//какая-то ошибка тут
        }
        break;
      }
    }
  }
}

export default SocketService;