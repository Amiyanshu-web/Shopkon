import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

// Example: get user authentication status from localStorage or context
const IsAuthenticated = () => {
    // Replace with your actual authentication logic
    // return !!localStorage.getItem('userToken');

    const userLogin=useSelector(state=>state.userLogin);
    const{userInfo}=userLogin;

    return userInfo && userInfo.token;
};

const ProtectedRoute = ({ redirectPath = '/login' }) => {
    return IsAuthenticated() ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;