import { combineReducers, createStore } from "redux";
import {tokenReducer, boardReducer, cardReducer, currentboardReducer} from "./reducer"

const rootReducer = combineReducers({auth : tokenReducer, boarddata : boardReducer, currentboardData : currentboardReducer, cardData : cardReducer})

const store = createStore(rootReducer);

export default store;