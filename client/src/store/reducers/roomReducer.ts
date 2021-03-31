import * as actionTypes from '../actionTypes';
const initial = {
  roomId: null,
  notFound: false,
}

function roomReducer(state=initial, action: any) {
  switch (action.type) {
    case actionTypes.SET_ROOM_ID:
      return {
        roomId: action.roomId,
        notFound: false,
      };
    case actionTypes.SET_NOT_FOUND:
      return {
        ...state,
        notFound: action.isNotFound,
      }
    default:
      return state;
  }
}

export default roomReducer;