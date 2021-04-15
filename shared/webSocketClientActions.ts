//client
import * as actionTypes from "./webSocketActionsTypes";
import {IUpdate} from "./Game.types";

export const joinAction = (roomId: string) => (<const>{
  type: actionTypes.JOIN,
  roomId,
});
export const setRoomSettingsAction = (settings: {name: string; createPuzzleOnlyOwner: boolean}) => (<const>{
  type: actionTypes.SET_ROOM_SETTINGS,
  settings,
});
export const setUpdateAction = (update: IUpdate) => (<const>{
  type: actionTypes.SET_UPDATE,
  update,
});
export const createAction = (optionId: string) => (<const>{
  type: actionTypes.CREATE,
  optionId,
});
export const getOptionsAction = (image: string) => (<const>{
  type: actionTypes.GET_OPTIONS,
  image,
});
