
export const set_acccess_token = 'settoken';
export const clear_acccess_token = 'cleartoken';

export const set_board_data = 'setboard'
export const clear_board_data = 'clearboard'

// Token Actions

export const setaccesstoken = (data) =>({
    type : set_acccess_token,
    payload : data
});

export const clearaccesstoken = () =>({
    type : clear_acccess_token
});

// Board Actions

export const setboarddata = (data) =>({
    type : set_board_data,
    payload : data
})