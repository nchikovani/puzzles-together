import {io} from "socket.io-client";
import {OptionTypes, UpdateTypes} from '../../../shared/Game.types'
import store from '../store';
import {setGameData, setUpdate, setOptions, setIsSolved} from '../store/actions';
import * as actions from "../../../shared/webSocketActions";
import {
  createAction,
  getOptionsAction,
  joinAction,
  setUpdateAction
} from "../../../shared/webSocketActions";
import * as actionTypes from "../../../shared/webSocketActionsTypes";

const SERVER_URL = 'http://localhost:8080';

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;
type ActionTypes = ReturnType<InferValueTypes<typeof actions>>;

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

  puzzleHandlers(action: ActionTypes) {
    switch (action.type) {
      case actionTypes.OPTIONS:
        store.dispatch(setOptions(action.options));
        break;
      case actionTypes.GAME_DATA:
        store.dispatch(setGameData(action.gameData));
        break;
      case actionTypes.UPDATE:
        store.dispatch(setUpdate(action.update));
        break;
      case actionTypes.SOLVED:
        store.dispatch(setIsSolved(true));
        break;
      case actionTypes.ERROR:
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