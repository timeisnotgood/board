import { combineReducers, createStore } from "redux";
import {tokenReducer, boardReducer, cardReducer} from "./reducer"

const rootReducer = combineReducers({auth : tokenReducer, boarddata : boardReducer, cardData : cardReducer})

const store = createStore(rootReducer);

export default store;