const initial = {
	gameData: null,
  update: null,
  options: null,
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
    case 'SET_OPTIONS':
      return {
        ...state,
        options: action.options,
      };
    default:
      return state;
  }
}

export default game;