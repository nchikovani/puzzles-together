//client
import * as actionTypes from "./webSocketActionsTypes";
import {OptionTypes, UpdateTypes} from "./Game.types";

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
