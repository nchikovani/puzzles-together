import * as actionTypes from '../actionTypes';
import {IGameData, IUpdate, IOption} from 'shared';
import React from "react";
import {ErrorShowType} from '../store.types';

export const setError = (isError: boolean, showType?: ErrorShowType, message?: string, statusCode?: number) => (<const>{
  type: actionTypes.SET_ERROR,
  isError,
  showType,
  message,
  statusCode,
});

export const openModalWindow = (content: React.ComponentElement<any, any>) => (<const>{
  type: actionTypes.OPEN_MODAL_WINDOW,
  content: content,
});

export const closeModalWindow = () => (<const>{
  type: actionTypes.CLOSE_MODAL_WINDOW,
});

export const setUser = (id: string, registered: boolean) => (<const>{
  type: actionTypes.SET_USER,
  id,
  registered,
  isLoaded: true,
});

export const setRooms = (rooms: any[], isLoaded: boolean) => (<const>{
  type: actionTypes.SET_ROOMS,
  rooms,
  isLoaded
});

export const addRoom = (room: any) => (<const>{
  type: actionTypes.ADD_ROOM,
  room,
});

export const setGameData = (gameData: IGameData | null) => (<const>{
  type: actionTypes.SET_GAME_DATA,
  gameData,
});

export const setOptions = (options: IOption[] | null) =>  (<const>{
  type: actionTypes.SET_OPTIONS,
  options,
});

export function setUpdate(update: IUpdate | null) {
  return <const>{
    type: actionTypes.SET_UPDATE,
    update,
  }
}

export function setIsSolved(isSolved: boolean) {
  return <const>{
    type: actionTypes.SET_IS_SOLVED,
    isSolved,
  }
}

export const clearGame = () =>  (<const>{
  type: actionTypes.CLEAR_GAME,
});
