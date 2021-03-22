import { combineReducers } from 'redux';
import cypressStatusReducer from './cypressStatus';
import connectionStatusReducer from './connectionStatus';

export default combineReducers({
    cypressStatus: cypressStatusReducer,
    connectionStatus: connectionStatusReducer,
});
