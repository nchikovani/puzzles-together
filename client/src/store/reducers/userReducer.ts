import * as actionTypes from '../actionTypes';
import {IUserState, ActionType} from "../store.types";

const initial: IUserState = {
  id: null,
  registered: false,
  isLoaded: false,
}

function userReducer(state: IUserState = initial, action: ActionType) {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        id: action.id,
        registered: action.registered,
        isLoaded: action.isLoaded,
      };

    default:
      return state;
  }
}

export default userReducer;