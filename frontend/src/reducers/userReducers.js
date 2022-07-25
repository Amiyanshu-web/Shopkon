export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case 'USER_LOGIN_REQUEST':
            return {
                loading: true
            }
            case 'USER_LOGIN_SUCCESS':
            return {
                loading: false,userInfo:action.payload
            }
            case 'USER_LOGIN_FAIL':
            return {
                loading: false,error:action.payload
            }
            case 'USER_LOGOUT':
                localStorage.clear();
            return {loading:false,userInfo:null}
        default:
            return state;
    }
}
export const googleLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case 'GOOGLE_LOGIN_REQUEST':
            return {
                loading: true
            }
            case 'GOOGLE_LOGIN_SUCCESS':
            return {
                loading: false,userInfo:action.payload
            }
            case 'GOOGLE_LOGIN_FAIL':
            return {
                loading: false,error:action.payload
            }
            case 'GOOGLE_LOGOUT':
                localStorage.clear();
            return {loading:false,userInfo:null}
        default:
            return state;
    }
}
export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case 'USER_REGISTER_REQUEST':
            return {
                loading: true
            }
            case 'USER_REGISTER_SUCCESS':
            return {
                loading: false,userInfo:action.payload
            }
            case 'USER_REGISTER_FAIL':
            return {
                loading: false,error:action.payload
            }
            
        default:
            return state;
    }
}

export const userDetailsReducer = (state = {}, action) => {
    switch (action.type) {
        case 'USER_DETAILS_REQUEST':
            return {
                ...state,loading: true
            }
            case 'USER_DETAILS_SUCCESS':
            return {
                loading: false,user:action.payload
            }
            case 'USER_DETAILS_FAIL':
            return {
                loading: false,error:action.payload
            }
            
        default:
            return state;
    }
}
export const userUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case 'USER_UPDATE_REQUEST':
            return {
                ...state,success:false,loading: true
            }
            case 'USER_UPDATE_SUCCESS':
            return {
                loading: false,success:true,userInfo:action.payload
            }
            case 'USER_UPDATE_FAIL':
            return {
                loading: false,error:action.payload
            }
            
        default:
            return state;
    }
}