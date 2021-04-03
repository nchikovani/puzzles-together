import {combineReducers} from 'redux';
import gameReducer from './gameReducer';
import roomReducer from './roomReducer';
import userReducer from './userReducer';
import roomsReducer from './roomsReducer';

export default combineReducers({
    game: gameReducer,
    room: roomReducer,
    user: userReducer,
    rooms: roomsReducer,
})