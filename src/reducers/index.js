import {combineReducers} from 'redux';
import game from './game';
import room from './room';

export default combineReducers({
    game,
    room,
})