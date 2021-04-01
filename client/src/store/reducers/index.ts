import {combineReducers} from 'redux';
import gameReducer from './gameReducer';
import roomReducer from './roomReducer';
import userReducer from './userReducer';
import personalAreaReducer from './personalAreaReducer';

export default combineReducers({
    game: gameReducer,
    room: roomReducer,
    user: userReducer,
    personalArea: personalAreaReducer,
})