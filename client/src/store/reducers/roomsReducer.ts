import * as actionTypes from '../actionTypes';
import {RoomTypes} from "../store.types";
import * as actions from "../actions";

const initial: RoomTypes[] = [];

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;
type ActionTypes = ReturnType<InferValueTypes<typeof actions>>;

function roomsReducer(state: RoomTypes[] = initial, action: ActionTypes) {
  switch (action.type) {
    case actionTypes.SET_ROOMS:
      return [
        ...action.rooms
      ];
    case actionTypes.ADD_ROOM:
      return [
        ...state,
        action.room
      ];

    default:
      return state;
  }
}

export default roomsReducer;