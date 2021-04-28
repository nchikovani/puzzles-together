import {IGameData, IOption, IUpdate} from "./Game.types";
import * as actionTypes from './webSocketActionsTypes';

//server
export const roomAction = (room: any, gameData: IGameData | null) => (<const>{
  type: actionTypes.ROOM,
  room,
  gameData,
});

export const roomSettingsAction = (name: string, createPuzzleOnlyOwner: boolean) => (<const>{
  type: actionTypes.ROOM_SETTINGS,
  name,
  createPuzzleOnlyOwner,
});

export const chatMessageAction = (message: any) => (<const>{
  type: actionTypes.CHAT_MESSAGE,
  message
});

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
