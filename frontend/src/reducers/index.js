import { combineReducers } from 'redux';
import cypressStatusReducer from './cypressStatus';

export default combineReducers({
    cypressStatus: cypressStatusReducer,
});
