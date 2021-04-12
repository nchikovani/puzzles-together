import {io} from "socket.io-client";
import {IUpdate, WebSocketServerActionsType} from 'shared';
import {webSocketActionsTypes, webSocketClientActions, ServerError} from 'shared';
import store from '../store';
import {setGameData, setUpdate, setOptions, setIsSolved} from '../store/actions';

const {createAction, getOptionsAction, joinAction, setUpdateAction} = webSocketClientActions;
const SERVER_URL = 'http://localhost:8080';


export default class socketService {
  readonly socket;
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

  private puzzleHandlers(action: WebSocketServerActionsType) {
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
        throw new ServerError(action.error.code, action.error.message);
    }
  }

  joinRoom(roomId: string) {
    this.socket.emit('room', joinAction(roomId));
  }

  getOptions(image: string) {
    this.socket.emit('puzzle', getOptionsAction(image));
  }

  createPuzzle(optionId: string) {
    this.socket.emit('puzzle', createAction(optionId));
  }

  sendUpdate (update: IUpdate) {
    this.socket.emit('puzzle', setUpdateAction(update));
  }
}