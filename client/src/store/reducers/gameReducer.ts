import * as actionTypes from '../actionTypes';
import {IGameState, ActionType} from "../store.types";

const initial: IGameState = {
	gameData: null,
  update: null,
  options: null,
  isSolved: false,
}

function gameReducer(state: IGameState = initial, action: ActionType) {
  switch (action.type) {
    case actionTypes.SET_GAME_DATA:
      return {
        ...state,
        gameData: action.gameData,
      };
    case actionTypes.SET_UPDATE:
      return {
        ...state,
        update: action.update,
      };
    case actionTypes.SET_IS_SOLVED:
      return {
        ...state,
        isSolved: action.isSolved,
      };
    case actionTypes.SET_OPTIONS:
      return {
        ...state,
        options: action.options,
      };
    case actionTypes.CLEAR_GAME:
      return {
        gameData: null,
        update: null,
        options: null,
        isSolved: false,
      };
    default:
      return state;
  }
}

export default gameReducer;