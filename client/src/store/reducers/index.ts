import {combineReducers} from 'redux';
import gameReducer from './gameReducer';
import errorReducer from './errorReducer';
import userReducer from './userReducer';
import roomsReducer from './roomsReducer';
import modalWindowReducer from './modalWindowReducer';

export default combineReducers({
    game: gameReducer,
    user: userReducer,
    rooms: roomsReducer,
    error: errorReducer,
    modalWindow: modalWindowReducer,
})