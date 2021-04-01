import {io} from "socket.io-client";
import {OptionTypes, UpdateTypes} from '../../../shared/Game.types'
import store from '../store';
import {setGameData, setUpdate, setRoomId, setNotFound, setOptions, setIsSolved} from '../store/actions';

const SERVER_URL = 'http://localhost:8080';

export default class socketService {
  socket;
  constructor() {
    this.socket = io(SERVER_URL, {
      transports: ['websocket', 'polling', 'flashsocket'],
      autoConnect: false,
    });

    //проверять входящие данные?
    this.socket.on('puzzle:options', (options) => {
      store.dispatch(setOptions(options));
    });
    this.socket.on('puzzle', (gameData) => {
      console.log('puzzle gameData');
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
  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  getOptions(image: string) {
    this.socket.emit('puzzle:getOptions', image);
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