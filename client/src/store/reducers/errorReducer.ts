import * as actionTypes from '../actionTypes';
import {ErrorStateTypes} from "../store.types";
import * as actions from "../actions";

const initial: ErrorStateTypes = {
  isError: false,
  showType: null,
  message: null,
  statusCode: null,
}

type InferValueTypes<T> = T extends { [key: string]: infer U} ? U : never;
type ActionTypes = ReturnType<InferValueTypes<typeof actions>>;

function errorReducer(state: ErrorStateTypes = initial, action: ActionTypes) {
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