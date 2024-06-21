import { combineReducers, createStore } from "redux";
import {tokenReducer, boardReducer} from "./reducer"

const rootReducer = combineReducers({auth : tokenReducer, boarddata : boardReducer})

const store = createStore(rootReducer);

export default store;