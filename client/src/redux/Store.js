import { combineReducers, createStore } from "redux";
import {tokenReducer} from "./reducer"

const rootReducer = combineReducers({auth : tokenReducer})

const store = createStore(rootReducer);

export default store;