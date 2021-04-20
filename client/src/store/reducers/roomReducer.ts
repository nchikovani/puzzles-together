import * as actionTypes from '../actionTypes';
import {IRoomState, ActionType} from "../store.types";

const initial: IRoomState = {
  id: null,
  owner: null,
  name: null,
  createPuzzleOnlyOwner: true,
  isLoaded: false,
}

function roomReducer(state: IRoomState = initial, action: ActionType) {
  switch (action.type) {
    case actionTypes.SET_ROOM:
      return {
        id: action.id,
        owner: action.owner,
        name: action.name || null,
        createPuzzleOnlyOwner: action.createPuzzleOnlyOwner,
        isLoaded: true,
      }
    case actionTypes.SET_ROOM_SETTINGS:
      return {
        ...state,
        name: action.name,
        createPuzzleOnlyOwner: action.createPuzzleOnlyOwner,
      }
    case actionTypes.CLEAR_ROOM:
      return initial;
    default:
      return state;
  }
}

export default roomReducer;