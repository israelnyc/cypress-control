import { combineReducers } from 'redux';
import cypressStatusReducer from './cypressStatus';
import connectionStatusReducer from './connectionStatus';
import specFilterReducer from './specFilter';
import cypressOptionsReducer from './cypressOptions';

export default combineReducers({
    cypressOptions: cypressOptionsReducer,
    cypressStatus: cypressStatusReducer,
    connectionStatus: connectionStatusReducer,
    specFilters: specFilterReducer,
});
