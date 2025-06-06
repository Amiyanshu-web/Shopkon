import axios from 'axios';
export const listProducts = (user_query='',page = 1) => async(dispatch)=>{
    try{
        dispatch({type:'PRODUCT_LIST_REQUEST'});
        const { data } = await axios.get(`${process.env.REACT_APP_PROXY}/api/products?user_query=${encodeURIComponent(user_query)}&page=${page}`);
        dispatch({type:'PRODUCT_LIST_SUCCESS',payload:
    {
            products: data.products, // Concatenate new data to existing products
            page,
            pages: data.pages,
            answer: data.answer
    }});
    }catch(error){
        dispatch({type:'PRODUCT_LIST_FAIL',payload:error.response && error.response.data.message?error.response.data.message:error.message});
    }
}
export const listProductDetails = (id) => async(dispatch)=>{
    try{
        dispatch({type:'PRODUCT_DETAILS_REQUEST'});
        const { data } = await axios.get(`${process.env.REACT_APP_PROXY}/api/products/${id}`);
        dispatch({type:'PRODUCT_DETAILS_SUCCESS',payload:data?.product});
    }catch(error){
        dispatch({type:'PRODUCT_DETAILS_FAIL',payload:error.response && error.response.data.message?error.response.data.message:error.message});
    }
}