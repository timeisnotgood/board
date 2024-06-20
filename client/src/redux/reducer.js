import { set_acccess_token, clear_acccess_token } from './actions'

const tokenDatastate = {
    "username" : null,
    "email" : null,
    "id" : null,
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

export {tokenReducer};