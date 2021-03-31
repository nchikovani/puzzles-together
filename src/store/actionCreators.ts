import * as actionTypes from './actionTypes';
import {GameDataType, UpdateType} from '../components/Game/Puzzles/Puzzles.types';

export const setGameData = (gameData: GameDataType) => (<const>{
  type: actionTypes.SET_GAME_DATA,
  gameData,
});

export const setOptions = (options: any) =>  (<const>{
  type: actionTypes.SET_OPTIONS,
  options,
});

export function setUpdate(update: UpdateType) {
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