import {io} from "socket.io-client";
import {OptionTypes, UpdateTypes, WebSocketServerActionsTypes} from 'shared';
import {webSocketActionsTypes, webSocketClientActions} from 'shared';
import store from '../store';
import {setGameData, setUpdate, setOptions, setIsSolved} from '../store/actions';

const {createAction, getOptionsAction, joinAction, setUpdateAction} = webSocketClientActions;
const SERVER_URL = 'http://localhost:8080';


export default class socketService {
  socket;
  constructor() {
    this.socket = io(SERVER_URL, {
      transports: ['websocket', 'polling', 'flashsocket'],
      autoConnect: false,
    });
    this.puzzleHandlers = this.puzzleHandlers.bind(this);

    this.socket.on("puzzle", this.puzzleHandlers);
  }
  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  puzzleHandlers(action: WebSocketServerActionsTypes) {
    switch (action.type) {
      case webSocketActionsTypes.OPTIONS:
        store.dispatch(setOptions(action.options));
        break;
      case webSocketActionsTypes.GAME_DATA:
        store.dispatch(setGameData(action.gameData));
        break;
      case webSocketActionsTypes.UPDATE:
        store.dispatch(setUpdate(action.update));
        break;
      case webSocketActionsTypes.SOLVED:
        store.dispatch(setIsSolved(true));
        break;
      case webSocketActionsTypes.ERROR:
        console.log(action.error);
        break;
    }
  }

  joinRoom(roomId: string) {
    this.socket.emit('room', joinAction(roomId));
  }

  getOptions(image: string) {
    this.socket.emit('puzzle', getOptionsAction(image));
  }

  createPuzzle(option: OptionTypes) {
    this.socket.emit('puzzle', createAction(option));
  }

  sendUpdate (update: UpdateTypes) {
    this.socket.emit('puzzle', setUpdateAction(update));
  }
}