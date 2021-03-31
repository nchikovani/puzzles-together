import {io} from "socket.io-client";
import {OptionTypes, UpdateTypes} from '../../../shared/Game.types'
import store from '../store';
import {setGameData, setUpdate, setRoomId, setNotFound, setOptions, setIsSolved} from '../store/actionCreators';

const SERVER_URL = 'http://localhost:8080';

export default class socketService {
  socket;
  constructor() {
    this.socket = io(SERVER_URL, {
      transports: ['websocket', 'polling', 'flashsocket']
    });
    //проверять входящие данные?
    this.socket.on('puzzle:options', (options) => {
      store.dispatch(setOptions(options));
    });
    this.socket.on('puzzle', (gameData) => {
      console.log('puzzle');
      store.dispatch(setGameData(gameData));
    });
    this.socket.on('puzzle:getUpdate', (update) => {
      console.log('update from server');
      store.dispatch(setUpdate(update));
    });
    this.socket.on('puzzle:solved', () => {
      console.log('solved');
      store.dispatch(setIsSolved(true));
    });
    this.socket.on('room', (roomId) => {
      store.dispatch(setRoomId(roomId));
    });
    this.socket.on('room:notFound', () => {
      store.dispatch(setNotFound(true));
    });

  }

  getOptions(image: string) {
    this.socket.emit('puzzle:getOptions', image);
  }

  createRoom() {
    this.socket.emit('room:create');
  }

  joinRoom(roomId: string) {
    this.socket.emit('room:join', roomId);
  }

  createPuzzle(option: OptionTypes) {
    this.socket.emit('puzzle:create', option);
  }

  sendUpdate (update: UpdateTypes) {
    this.socket.emit('puzzle:setUpdate', update);
  }
}