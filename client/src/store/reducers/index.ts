import {combineReducers} from 'redux';
import gameReducer from './gameReducer';
import roomReducer from './roomReducer';
import userReducer from './userReducer';

export default combineReducers({
    game: gameReducer,
    room: roomReducer,
    user: userReducer,
})