import {IGameData, IOption, IUpdate} from "./Game.types";
import * as actionTypes from './webSocketActionsTypes';

//server
export const gameDataAction = (gameData: IGameData) => (<const>{
  type: actionTypes.GAME_DATA,
  gameData,
});
export const optionsAction = (options: IOption[]) => (<const>{
  type: actionTypes.OPTIONS,
  options,
});
export const updateAction = (update: IUpdate) => (<const>{
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
