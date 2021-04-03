import {Server, Socket} from "socket.io";
import Puzzle from "../utils/Puzzle";
import RoomsService from '../rooms/rooms.service';
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {RoomTypes} from '../rooms/room.model';
import {
  gameDataAction,
  optionsAction,
  updateAction,
  errorAction,
  solvedAction
} from '../../../shared/webSocketActions';
import * as actionsTypes from '../../../shared/webSocketActionsTypes';
import * as actions from '../../../shared/webSocketActions';

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;
type ActionTypes = ReturnType<InferValueTypes<typeof actions>>;

interface activeRoomTypes extends RoomTypes{
  puzzle?: Puzzle;
}

class SocketService {
  io: Server<DefaultEventsMap, DefaultEventsMap>;
  socket: Socket & {roomId?: string;};//?
  activeRooms: activeRoomTypes[] = [];

  constructor(io: Server<DefaultEventsMap, DefaultEventsMap>, socket: Socket & {roomId?: string;}) {
    this.io = io;
    this.socket = socket;

    this.roomHandlers = this.roomHandlers.bind(this);
    this.puzzleHandlers = this.puzzleHandlers.bind(this);
  }

  registerListener() {
    const {socket} = this;
    socket.on("room", this.roomHandlers);
    socket.on("puzzle", this.puzzleHandlers);
  }

  async roomHandlers(action: ActionTypes) {
    const {socket} = this;
    switch (action.type) {
      case actionsTypes.JOIN: {
        let joinRoom: activeRoomTypes;
        const activeRoom = this.activeRooms.find(activeRoom => activeRoom._id === action.roomId);
        if (activeRoom) {
          joinRoom = activeRoom;
          const puzzle = joinRoom.puzzle;
          const gameData = puzzle && puzzle.getGameData();
          if (gameData) {
            socket.emit("puzzle", gameDataAction(gameData));
          } else {
            return socket.emit("room", errorAction(4, ''));//какая-то ошибка тут
          }
        } else {
          const room = await RoomsService.getRoomById(action.roomId);
          if (room !== undefined) {
            if (room) {
              joinRoom = room;
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
              return socket.emit("room", errorAction(404, 'Room not found.'));
            }
          } else {
            return socket.emit("room", errorAction(500, 'Unable find room.'));
          }
        }
        socket.roomId = action.roomId;
        socket.join(action.roomId);
        break;
      }
    }
  }

  puzzleHandlers(action: ActionTypes) {
    const {io, socket} = this;
    switch (action.type) {
      case actionsTypes.GET_OPTIONS: {//проверять токен
        const roomId = socket.roomId;
        if (roomId) {
          const room = this.activeRooms.find(activeRoom => activeRoom._id === roomId)
          if (room) {
            room.puzzle = new Puzzle(action.image);
            const options = room.puzzle.getPartsCountOptions();
            //если что, отправлять ошибку, проверять входящие данные??
            socket.emit("puzzle", optionsAction(options));
          } else {
            return socket.emit("room", errorAction(404, 'Room not found.'));
          }
        } else {
          return socket.emit("room", errorAction(4, ''));//какая-то ошибка тут
        }
        break;
      }
      case actionsTypes.CREATE: {//проверять токен
        const roomId = socket.roomId;
        if (roomId) {
          const room = this.activeRooms.find(activeRoom => activeRoom._id === roomId)
          if (room) {
            if (room.puzzle) {
              room.puzzle.createPuzzle(action.option);
              const gameData = room.puzzle.getGameData();
              //если что, отправлять ошибку, проверять входящие данные??
              socket.emit("puzzle", gameDataAction(gameData));
            } else {
              return socket.emit("room", errorAction(4, ''));//какая-то ошибка тут
            }
          } else {
            return socket.emit("room", errorAction(404, 'Room not found.'));
          }
        } else {
          return socket.emit("room", errorAction(4, ''));//какая-то ошибка тут
        }
        break;
      }
      case actionsTypes.SET_UPDATE: {
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
              return socket.emit("room", errorAction(4, ''));//какая-то ошибка тут
            }
          } else {
            return socket.emit("room", errorAction(404, 'Room not found.'));
          }
        } else {
          return socket.emit("room", errorAction(4, ''));//какая-то ошибка тут
        }
        break;
      }
    }
  }
}

export default SocketService;