import {combineReducers} from 'redux';
import gameReducer from './gameReducer';
import errorReducer from './errorReducer';
import userReducer from './userReducer';
import roomsReducer from './roomsReducer';

export default combineReducers({
    game: gameReducer,
    user: userReducer,
    rooms: roomsReducer,
    error: errorReducer,
})