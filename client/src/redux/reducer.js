import { set_acccess_token, clear_acccess_token, set_board_data, clear_board_data, set_card_data, set_currentboard_data, clear_currentboard_data } from './actions'

const tokenDatastate = {
    "username" : null,
    "email" : null,
    "id" : null,
}

const brddata = {
    "brd_title" : null,
    "created_at" : null,
    "id" : null,
    "list" : null,
    "list_order" : null
}

const currentbrddata = {
    "brd_title" : null,
    "created_at" : null,
    "id" : null,
    "list" : null,
    "list_order" : null
}

const carddata = {
    "cards": null,
    "card_order":null,
    "list_title":null,
    "list_id":null
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

// boards Reducer

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

// current boards Reducer

const currentboardReducer = (state = currentbrddata, action) =>{
    switch (action.type) {
        case set_currentboard_data:
            return action.payload
        case clear_currentboard_data:
            return null
        default:
            return state;
    }
}

// card Reducer

const cardReducer = (state = carddata, action) =>{
    switch (action.type){
        case set_card_data:
            return action.payload
        case clear_acccess_token:
            return null
        default :
            return state
    }
}
export {tokenReducer, boardReducer, currentboardReducer, cardReducer};