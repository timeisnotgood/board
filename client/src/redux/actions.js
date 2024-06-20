
export const set_acccess_token = 'settoken';
export const clear_acccess_token = 'cleartoken';


// Token Actions

export const setaccesstoken = (data) =>({
    type : set_acccess_token,
    payload : data
});

export const clearaccesstoken = () =>({
    type : clear_acccess_token
});