const initial = {
  roomId: null,
  notFound: false,
}

function room(state=initial, action: any) {
  switch (action.type) {
    case 'SET_ROOM_ID':
      return {
        roomId: action.roomId,
        notFound: false,
      };
    case 'SET_NOT_FOUND':
      return {
        ...state,
        notFound: action.isNotFound,
      }
    default:
      return state;
  }
}

export default room;