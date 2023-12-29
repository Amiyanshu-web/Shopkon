import axios from "axios";


export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`${process.env.REACT_APP_PROXY}/api/products/${id}`);
//   dispatch({ type:'CART_ADD_ITEM', payload: { id, ...data, qty } });

  dispatch({
    type: 'CART_ADD_ITEM',
    payload: {
      product: data.product._id,
      name: data.product.name,
      image: data.product.image,
      price: data.product.price,
      countInStock: data.product.countInStock,
      qty,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: 'CART_REMOVE_ITEM',
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const resetCart = () => async (dispatch, getState) => {
  dispatch({ type: 'CART_RESET' });
  localStorage.removeItem("cartItems");
};

export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch({
    type: 'CART_SAVE_SHIPPING_ADDRESS',
    payload: data,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => async (dispatch) => {
  dispatch({
    type: 'CART_SAVE_PAYMENT_METHOD',
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};