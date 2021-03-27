import {io} from "socket.io-client";
import {UpdateType} from '../components/Game/Puzzles/Puzzles.types'
import store from '../store';
import {setGameData, setUpdate, setRoomId, setNotFound, setOptions} from '../actions';

const SERVER_URL = 'http://localhost:8080';

export default class socketService {
  socket;
  constructor() {
    this.socket = io(SERVER_URL, {
      transports: ['websocket', 'polling', 'flashsocket']
    });
    this.socket.on('puzzle:options', (options) => {
      store.dispatch(setOptions(options));
    });
    this.socket.on('puzzle', (puzzle) => {
      console.log('puzzle');
      store.dispatch(setGameData(puzzle));
    });
    this.socket.on('puzzle:getUpdate', (data) => {
      console.log('get from server');
      store.dispatch(setUpdate(data.update));
    });
    this.socket.on('room', (roomId) => {
      store.dispatch(setRoomId(roomId));
    });
    this.socket.on('room:notFound', () => {
      store.dispatch(setNotFound(true));
    });

  }

  getOptions(image: string) {
    this.socket.emit('puzzle:getOptions', { image });
  }

  createRoom() {
    this.socket.emit('room:create');
  }

  joinRoom(roomId: string) {
    this.socket.emit('room:join', {roomId});
  }

  createPuzzle(option: object) {
    this.socket.emit('puzzle:create', { option });
  }

  sendUpdate (update: UpdateType) {
    this.socket.emit('puzzle:setUpdate', { update });
  }
  // handleGettingPuzzle(handle: (puzzles: GameDataType)=>void) {
  //   this.socket.on('puzzle', (puzzles) => {
  //     handle(puzzles);
  //     console.log('puzzle');
  //   });
  // }

  // handleGettingUpdate (handler: (update: UpdateType) => void) {
  //   this.socket.on('puzzle:getUpdate', (data) => {
  //     handler(data.update);
  //   });
  // }

}