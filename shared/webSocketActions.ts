import {GameDataTypes, OptionTypes, UpdateTypes} from "./Game.types";
import * as actionTypes from './webSocketActionsTypes';

//client
export const joinAction = (roomId: string) => (<const>{
  type: actionTypes.JOIN,
  roomId,
});
export const setUpdateAction = (update: UpdateTypes) => (<const>{
  type: actionTypes.SET_UPDATE,
  update,
});
export const createAction = (option: OptionTypes) => (<const>{
  type: actionTypes.CREATE,
  option,
});
export const getOptionsAction = (image: string) => (<const>{
  type: actionTypes.GET_OPTIONS,
  image,
});

//server
export const gameDataAction = (gameData: GameDataTypes) => (<const>{
  type: actionTypes.GAME_DATA,
  gameData,
});
export const optionsAction = (options: OptionTypes[]) => (<const>{
  type: actionTypes.OPTIONS,
  options,
});
export const updateAction = (update: UpdateTypes) => (<const>{
  type: actionTypes.UPDATE,
  update,
});
export const solvedAction = () => (<const>{
  type: actionTypes.SOLVED,
});

export const errorAction = (code: number, message: string) => (<const>{
  type: actionTypes.ERROR,
  error: {
    code: code,
    message: message,
  }
})
