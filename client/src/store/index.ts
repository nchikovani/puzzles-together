import {createStore} from 'redux';
import rootReducer from './reducers';

const index = createStore(
	rootReducer,// @ts-ignore
	window.__REDUX_DEVTOOLS_EXTENSION__ &&// @ts-ignore
	window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default index;