import { combineReducers } from 'redux';
import cypressStatusReducer from './cypressStatus';
import connectionStatusReducer from './connectionStatus';
import specSelectionsReducer from './specSelections';
import specFilterReducer from './specFilter';

export default combineReducers({
    cypressStatus: cypressStatusReducer,
    connectionStatus: connectionStatusReducer,
    specSelections: specSelectionsReducer,
    specFilters: specFilterReducer,
});
