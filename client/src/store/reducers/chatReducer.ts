import * as actionTypes from '../actionTypes';
import {IChatState, ActionType} from "../store.types";

const initial: IChatState = {
  id: null,
  messages: [],
  isLoaded: false,
}

function chatReducer(state: IChatState = initial, action: ActionType) {
  switch (action.type) {
    case actionTypes.SET_CHAT:
      return {
        ...action.chat,
        id: action.chat._id,
        isLoaded: true,
      }
    case actionTypes.ADD_CHAT_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.message]
      }
    case actionTypes.CLEAR_CHAT:
      return initial;
    default:
      return state;
  }
}

export default chatReducer;