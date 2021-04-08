import * as actionTypes from '../actionTypes';
import {GameDataTypes, UpdateTypes, OptionTypes} from 'shared';

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

export const setGameData = (gameData: GameDataTypes) => (<const>{
  type: actionTypes.SET_GAME_DATA,
  gameData,
});

export const setOptions = (options: OptionTypes[]) =>  (<const>{
  type: actionTypes.SET_OPTIONS,
  options,
});

export function setUpdate(update: UpdateTypes) {
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

export function setRoomId(roomId: string) {
  return <const>{
    type: actionTypes.SET_ROOM_ID,
    roomId,
  }
}

export function setNotFound(isNotFound: boolean) {
  return <const>{
    type: actionTypes.SET_NOT_FOUND,
    isNotFound,
  }
}
