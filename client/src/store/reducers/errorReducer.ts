import * as actionTypes from '../actionTypes';
import {IErrorState, ActionType} from "../store.types";

const initial: IErrorState = {
  isError: false,
  showType: null,
  message: null,
  statusCode: null,
}

function errorReducer(state: IErrorState = initial, action: ActionType) {
  switch (action.type) {
    case actionTypes.SET_ERROR:
      return {
        isError: action.isError,
        showType: action.showType || null,
        message: action.message || null,
        statusCode: action.statusCode || null,
      }

    default:
      return state;
  }
}

export default errorReducer;