import * as actionTypes from '../actionTypes';
import {GameStateTypes} from "../store.types";
import * as actions from "../actionCreators";

const initial: GameStateTypes = {
	gameData: null,
  update: null,
  options: null,
  isSolved: false,
}

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;
type ActionTypes = ReturnType<InferValueTypes<typeof actions>>;

function gameReducer(state: GameStateTypes = initial, action: ActionTypes) {
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
    default:
      return state;
  }
}

export default gameReducer;