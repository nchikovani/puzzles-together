import * as actionTypes from '../actionTypes';
import {UserStateTypes} from "../store.types";
import * as actions from "../actions";

const initial: UserStateTypes = {
  id: null,
  rooms: [],
}

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;
type ActionTypes = ReturnType<InferValueTypes<typeof actions>>;

function userReducer(state: UserStateTypes = initial, action: ActionTypes) {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        id: action.id,
      };
    case actionTypes.SET_ROOMS:
      return {
        ...state,
        rooms: action.rooms,
      };

    default:
      return state;
  }
}

export default userReducer;