const initial = {
	gameData: null,
  update: null,
}

function game(state=initial, action) {
  switch (action.type) {
    case 'SET_GAME_DATA':
      return {
        ...state,
        gameData: action.gameData,
      };
    case 'SET_UPDATE':
      return {
        ...state,
        update: action.update,
      };
    default:
      return state;
  }
}

export default game;