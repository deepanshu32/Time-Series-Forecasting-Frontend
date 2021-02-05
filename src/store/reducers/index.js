import { combineReducers } from "redux";
import uploadReducer from "./uploadReducer";
import authReducer from './auth';

export default combineReducers({
    upload: uploadReducer,
    auth: authReducer
});
