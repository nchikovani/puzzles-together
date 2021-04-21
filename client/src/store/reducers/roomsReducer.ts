import * as actionTypes from '../actionTypes';
import {IRoomsState, ActionType} from "../store.types";

const initial: IRoomsState = {
  ownRooms: [],
  visitedRooms: [],
  isLoaded: false,
}

function roomsReducer(state: IRoomsState = initial, action: ActionType) {
  switch (action.type) {
    case actionTypes.SET_ROOMS:
      return {
        ownRooms: action.ownRooms,
        visitedRooms: action.visitedRooms,
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