import axios from 'axios';
export const login = (email,password) => async(dispatch)=>{
    try{
        dispatch({type:'USER_LOGIN_REQUEST'});
        const config={
            headers:{
                'Content-Type':'application/json'
        }
    }
        const {data}=await axios.post('/api/users/login',{email,password},config);
        dispatch({type:'USER_LOGIN_SUCCESS',payload:data});
        localStorage.setItem('userInfo',JSON.stringify(data));
    }catch(error){
        dispatch({type:'USER_LOGIN_FAIL',payload:error.response && error.response.data.message?error.response.data.message:error.message});
    }
}


export const googleLogin = (tokenId,email,name,email_verified) => async(dispatch)=>{
    try{
        dispatch({type:'GOOGLE_LOGIN_REQUEST'});
        const config={
            headers:{
                'Content-Type':'application/json'
        }
    }
        const {data}=await axios.post('/api/users/googlelogin',{tokenId},config);
        dispatch({type:'GOOGLE_LOGIN_SUCCESS',payload:data});
        localStorage.setItem('userInfo',JSON.stringify(data));
    }catch(error){
        dispatch({type:'GOOGLE_LOGIN_FAIL',payload:error.response && error.response.data.message?error.response.data.message:error.message});
    }
}


export const logout=()=>async(dispatch)=>{
    localStorage.removeItem('userInfo');
    dispatch({type:'USER_LOGOUT'})
}


export const register = (name,email,password) => async(dispatch)=>{
    try{
        dispatch({type:'USER_REGISTER_REQUEST'});
        const config={
            headers:{
                'Content-Type':'application/json'
        }
    }
        const {data}=await axios.post('/api/users',{name,email,password},config);
        dispatch({type:'USER_REGISTER_SUCCESS',payload:data});
        dispatch({type:'USER_LOGIN_SUCCESS',payload:data});
        localStorage.setItem('userInfo',JSON.stringify(data));

}catch(error){
    dispatch({type:'USER_REGISTER_FAIL',payload:error.response && error.response.data.message?error.response.data.message:error.message});
}

}

export const getUserDetails = (id) => async(dispatch,getState)=>{
    try{
        dispatch({type:'USER_DETAILS_REQUEST'});
        const {userLogin:{userInfo}}=getState();
        const config={
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${userInfo.token}`
        }
    }
        const {data}=await axios.get(`/api/users/${id}`,config);
        dispatch({type:'USER_DETAILS_SUCCESS',payload:data});
       

}catch(error){
    dispatch({type:'USER_DETAILS_FAIL',payload:error.response && error.response.data.message?error.response.data.message:error.message});
}

}

export const UserUpdateDetails = (user) => async(dispatch,getState)=>{
    try{
        dispatch({type:'USER_UPDATE_REQUEST'});
        const {userLogin:{userInfo}}=getState();
        const config={
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${userInfo.token}`
        }
    }
        const {data}=await axios.put(`/api/users/profile`,user,config);
        dispatch({type:'USER_UPDATE_SUCCESS',payload:data});
        localStorage.setItem('userInfo',JSON.stringify(data));

       

}catch(error){
    dispatch({type:'USER_UPDATE_FAIL',payload:error.response && error.response.data.message?error.response.data.message:error.message});
}

}