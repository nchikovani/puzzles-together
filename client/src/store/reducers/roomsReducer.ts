import * as actionTypes from '../actionTypes';
import {IRoomsState, ActionType} from "../store.types";

const initial: IRoomsState = {
  list: [],
  isLoaded: false,
}

function roomsReducer(state: IRoomsState = initial, action: ActionType) {
  switch (action.type) {
    case actionTypes.SET_ROOMS:
      return {
        list: action.rooms,
        isLoaded: action.isLoaded,
      }
    // case actionTypes.ADD_ROOM:
    //   return [
    //     ...state,
    //     action.room
    //   ];

    default:
      return state;
  }
}

export default roomsReducer;