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

      socket.on("room", (action) => this.roomRouters(action, socket));
      socket.on("puzzle", (action) => this.puzzleRouters(action, socket));

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

  async roomRouters(action: WebSocketClientActionsTypes, socket: SocketObject) {
    switch (action.type) {
      case webSocketActionsTypes.JOIN: {
        let joinRoom: activeRoomTypes;
        const activeRoom = this.activeRooms.find(activeRoom => activeRoom._id == action.roomId);
        if (activeRoom) {
          joinRoom = activeRoom;
          const puzzle = joinRoom.puzzle;
          if (puzzle) {
            try {
              const gameData = puzzle && puzzle.getGameData();
              socket.emit("puzzle", gameDataAction(gameData));
            } catch (error) {
              return this.handleError(new MyError(error.code, error.message), socket, 'puzzle');
            }
          }
        } else {
          try {
            const room = await RoomsService.getRoomById(action.roomId);
            if (room) {
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
            } else {
              return this.handleError(new MyError(404, 'Room not found.'), socket, 'puzzle');
            }
          } catch (error) {
            return this.handleError(new MyError(error.code, error.message), socket, 'puzzle');
          }
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
        try {
          const roomId = socket.roomId;
          this.checkIsJoin(roomId);
          const room = this.activeRooms.find(activeRoom => activeRoom._id == roomId);
          this.checkRoom(room);
          const newPuzzle = new Puzzle();
          newPuzzle.init(action.image);
          room.puzzle = newPuzzle;
          socket.emit("puzzle", optionsAction(newPuzzle.options));
        } catch (error) {
          return this.handleError(new MyError(error.code, error.message), socket, 'puzzle');
        }

        const roomId = socket.roomId;
        if (roomId) {
          const room = this.activeRooms.find(activeRoom => activeRoom._id == roomId);
          if (room) {
            try {
              const newPuzzle = new Puzzle();
              newPuzzle.init(action.image);
              room.puzzle = newPuzzle;
              socket.emit("puzzle", optionsAction(newPuzzle.options));
            } catch (error) {
              return this.handleError(new MyError(error.code, error.message), socket, 'puzzle');
            }
          } else {
            return this.handleError(new MyError(404, 'Room not found.'), socket, 'puzzle');
          }
        } else {
          return this.handleError(new MyError(400, 'Did not join the room.'), socket, 'puzzle');
        }
        break;
      }
      case webSocketActionsTypes.CREATE: {//проверять токен
        const roomId = socket.roomId;
        if (roomId) {
          const room = this.activeRooms.find(activeRoom => activeRoom._id === roomId)
          if (room) {
            if (room.puzzle) {
              try {
                room.puzzle.createPuzzle(action.optionId);
                const gameData = room.puzzle.getGameData();
                socket.emit("puzzle", gameDataAction(gameData));
              } catch (error) {
                return this.handleError(new MyError(error.code, error.message), socket, 'puzzle');
              }
            } else {
              return this.handleError(new MyError(400, 'Puzzle not created.'), socket, 'puzzle');
            }
          } else {
            return this.handleError(new MyError(404, 'Room not found.'), socket, 'puzzle');
          }
        } else {
          return this.handleError(new MyError(400, 'Did not join the room.'), socket, 'puzzle');
        }
        break;
      }
      case webSocketActionsTypes.SET_UPDATE: {
        const roomId = socket.roomId;
        if (roomId) {
          const room = this.activeRooms.find(activeRoom => activeRoom._id === roomId)
          if (room) {
            if (room.puzzle) {
              const beforeIsSolved = room.puzzle.isSolved;
              try {
                room.puzzle.update(action.update);
              } catch (error) {
                return this.handleError(new MyError(error.code, error.message), socket, 'puzzle');
              }
              socket.broadcast.to(roomId).emit("puzzle", updateAction(action.update));
              if (!beforeIsSolved && room.puzzle.isSolved) {
                io.to(roomId).emit("puzzle", solvedAction());
              }
            } else {
              return this.handleError(new MyError(400, 'Puzzle not created.'), socket, 'puzzle');
            }
          } else {
            return this.handleError(new MyError(404, 'Room not found.'), socket, 'puzzle');
          }
        } else {
          return this.handleError(new MyError(400, 'Did not join the room.'), socket, 'puzzle');
        }
        break;
      }
    }
  }

  checkIsJoin(roomId: string | undefined) {
    if (!roomId) throw new MyError(400, 'Did not join the room.');
  }

  checkRoom(room: activeRoomTypes | undefined) {
    if (!room) return throw new MyError(404, 'Room not found.');
  }

  handleError (error: any, socket: SocketObject, ev: string) {
    if (error instanceof MyError) {
      return socket.emit(ev, errorAction(error.code, error.message));
    } else if (error instanceof Error) {
      return socket.emit(ev, errorAction(500, error.message));
    } else {
      return socket.emit(ev, errorAction(500, 'Server Error'));
    }
  }
}

export default SocketService;