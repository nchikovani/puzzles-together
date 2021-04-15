import * as actionTypes from '../actionTypes';
import {IModalWindowState, ActionType} from "../store.types";

const initial: IModalWindowState = {
  isOpen: false,
  content: null,
}

function errorReducer(state: IModalWindowState = initial, action: ActionType) {
  switch (action.type) {
    case actionTypes.OPEN_MODAL_WINDOW:
      return {
        isOpen: true,
        content: action.content,
      }
    case actionTypes.CLOSE_MODAL_WINDOW:
      return {
        isOpen: false,
      }

    default:
      return state;
  }
}

export default errorReducer;