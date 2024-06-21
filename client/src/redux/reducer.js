import { set_acccess_token, clear_acccess_token, set_board_data, clear_board_data } from './actions'

const tokenDatastate = {
    "username" : null,
    "email" : null,
    "id" : null,
}

const brddata = {
    "brd_title" : null,
    "created_at" : null,
    "list" : null,
    "list_order" : null
}

// Token Reducer

const tokenReducer = (state = tokenDatastate, action) =>{
    switch (action.type) {
        case set_acccess_token :
            return  action.payload;
        case clear_acccess_token :
            return null
        default:
            return state;
    }
}

const boardReducer = (state = brddata, action) =>{
    switch (action.type) {
        case set_board_data:
            return action.payload
        case clear_board_data:
            return null
        default:
            return state;
    }
}

export {tokenReducer, boardReducer};