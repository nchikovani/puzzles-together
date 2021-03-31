import {combineReducers} from 'redux';
import gameReducer from './gameReducer';
import roomReducer from './roomReducer';

export default combineReducers({
    game: gameReducer,
    room: roomReducer,
})