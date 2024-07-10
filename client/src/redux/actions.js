export const set_acccess_token = 'settoken';
export const clear_acccess_token = 'cleartoken';

export const set_board_data = 'setboard'
export const clear_board_data = 'clearboard'

export const set_currentboard_data = 'setcurrentboard'
export const clear_currentboard_data = 'clearcurrentboard'

export const set_card_data = 'setcard'
export const clear_card_data = 'clearcard'

// Token Actions

export const setaccesstoken = (data) =>({
    type : set_acccess_token,
    payload : data
});

export const clearaccesstoken = () =>({
    type : clear_acccess_token
});

// Board Actions

export const setboarddataredux = (data) =>({
    type : set_board_data,
    payload : data
})

// Current board Action

export const setcurrentboarddataredux = (data) =>({
    type : set_currentboard_data,
    payload : data
})

// cardData Action
export const setcarddataredux = (data) =>({
    type : set_card_data,
    payload : data
})