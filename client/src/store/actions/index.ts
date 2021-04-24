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

//user
export const setUser = (id: string, registered: boolean) => (<const>{
  type: actionTypes.SET_USER,
  id,
  registered,
  isLoaded: true,
});

//rooms
export const setRooms = (ownRooms: any[], visitedRooms: any[], isLoaded: boolean) => (<const>{
  type: actionTypes.SET_ROOMS,
  ownRooms,
  visitedRooms,
  isLoaded
});
export const deleteRoom = (roomId: string) => (<const>{
  type: actionTypes.DELETE_ROOM,
  roomId,
});

//room - activeRoom
export const setRoom = (id: string, owner: string, name: string | undefined, createPuzzleOnlyOwner: boolean) => (<const>{
  type: actionTypes.SET_ROOM,
  id,
  owner,
  name,
  createPuzzleOnlyOwner,
});
export const setRoomSettings = (name: string, createPuzzleOnlyOwner: boolean) => (<const>{
  type: actionTypes.SET_ROOM_SETTINGS,
  name,
  createPuzzleOnlyOwner,
});
export const clearRoom = () => (<const>{
  type: actionTypes.CLEAR_ROOM,
});

//chat
export const setChat = (chat: any) => (<const>{
  type: actionTypes.SET_CHAT,
  id: chat.id,
  messages: chat.messages,
});
export const addChatMessage = (message: any) => (<const>{
  type: actionTypes.ADD_CHAT_MESSAGE,
  message,
});
export const clearChat = (message: any) => (<const>{
  type: actionTypes.CLEAR_CHAT,
  message,
});

//puzzle
export const setGameData = (gameData: IGameData | null) => (<const>{
  type: actionTypes.SET_GAME_DATA,
  gameData,
});
export const setOptions = (options: IOption[] | null) =>  (<const>{
  type: actionTypes.SET_OPTIONS,
  options,
});
export function setUpdate(update: IUpdate | null) {//только комната
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
