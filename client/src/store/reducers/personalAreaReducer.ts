import * as actionTypes from '../actionTypes';
import {PersonalAreaTypes} from "../store.types";
import * as actions from "../actions";

const initial: PersonalAreaTypes = {
  rooms: [],
  isOwner: false,
}

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;
type ActionTypes = ReturnType<InferValueTypes<typeof actions>>;

function userReducer(state: PersonalAreaTypes = initial, action: ActionTypes) {
  switch (action.type) {
    case actionTypes.SET_PERSONAL_AREA:
      return {
        rooms: action.rooms,
        isOwner: action.isOwner,
      };
    case actionTypes.SET_PERSONAL_AREA_ROOMS:
      return {
        ...state,
        rooms: action.rooms,
      };

    default:
      return state;
  }
}

export default userReducer;