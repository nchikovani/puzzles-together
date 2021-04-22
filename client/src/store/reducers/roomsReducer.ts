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
    case actionTypes.DELETE_ROOM:
      return {
        ...state,
        ownRooms: state.ownRooms.filter((room) => room._id !== action.roomId),
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