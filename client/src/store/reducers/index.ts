import {combineReducers} from 'redux';
import gameReducer from './gameReducer';
import errorReducer from './errorReducer';
import userReducer from './userReducer';
import roomsReducer from './roomsReducer';
import roomReducer from './roomReducer';
import chatReducer from './chatReducer';
import modalWindowReducer from './modalWindowReducer';

export default combineReducers({
    game: gameReducer,
    user: userReducer,
    rooms: roomsReducer,
    chat: chatReducer,
    room: roomReducer,
    error: errorReducer,
    modalWindow: modalWindowReducer,
})