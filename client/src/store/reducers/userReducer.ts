import * as actionTypes from '../actionTypes';
import {UserStateTypes} from "../store.types";
import * as actions from "../actions";

const initial: UserStateTypes = {
  id: null,
  registered: false,
}

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;
type ActionTypes = ReturnType<InferValueTypes<typeof actions>>;

function userReducer(state: UserStateTypes = initial, action: ActionTypes) {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        id: action.id,
        registered: action.registered
      };

    default:
      return state;
  }
}

export default userReducer;