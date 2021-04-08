import * as actionTypes from '../actionTypes';
import {RoomsTypes} from "../store.types";
import * as actions from "../actions";

const initial = {
  list: [],
  isLoaded: false,
}

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;
type ActionTypes = ReturnType<InferValueTypes<typeof actions>>;

function roomsReducer(state: RoomsTypes = initial, action: ActionTypes) {
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