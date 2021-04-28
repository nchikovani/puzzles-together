import {io} from "socket.io-client";
import {IUpdate, WebSocketServerActionsType} from 'shared';
import {webSocketActionsTypes, webSocketClientActions, ServerError} from 'shared';
import store from '../store';
import {
  setGameData,
  setUpdate,
  setOptions,
  setIsSolved,
  setRoom,
  setRoomSettings,
  addChatMessage
} from '../store/actions';

const {createAction, getOptionsAction, joinAction, setUpdateAction, setRoomSettingsAction, sendChatMessageAction} = webSocketClientActions;
const SERVER_URL = 'http://localhost:8080';


export default class socketService {
  readonly socket;
  constructor() {
    this.socket = io(SERVER_URL, {
      transports: ['websocket', 'polling', 'flashsocket'],
      autoConnect: false,
    });
    this.puzzleHandlers = this.puzzleHandlers.bind(this);
    this.roomHandlers = this.roomHandlers.bind(this);

    this.socket.on("puzzle", this.puzzleHandlers);
    this.socket.on("room", this.roomHandlers);
    this.socket.on("chat", this.chatHandlers);

    this.socket.on('connect_error', (error) => {
      throw new ServerError(500, error.message);
    });
  }
  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  private roomHandlers(action: WebSocketServerActionsType) {
    switch (action.type) {
      case webSocketActionsTypes.ROOM:
        store.dispatch(setGameData(action.gameData));
        store.dispatch(setRoom(action.room));
        break;
      case webSocketActionsTypes.ROOM_SETTINGS:
        store.dispatch(setRoomSettings(action.name, action.createPuzzleOnlyOwner));
        break;
      case webSocketActionsTypes.ERROR:
        throw new ServerError(action.error.code || 500, action.error.message);
    }
  }

  private chatHandlers(action: WebSocketServerActionsType) {
    switch (action.type) {
      case webSocketActionsTypes.CHAT_MESSAGE:
        store.dispatch(addChatMessage(action.message));
        break;
      case webSocketActionsTypes.ERROR:
        throw new ServerError(action.error.code || 500, action.error.message);
    }
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
        throw new ServerError(action.error.code || 500, action.error.message);
    }
  }

  joinRoom(roomId: string) {
    this.socket.emit('room', joinAction(roomId));
  }

  setRoomSettings(roomSettings: {name: string; createPuzzleOnlyOwner: boolean}) {
    this.socket.emit('room', setRoomSettingsAction(roomSettings));
  }

  sendMessage(chatId: string, message: string) {
    this.socket.emit('chat', sendChatMessageAction(chatId, message));
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