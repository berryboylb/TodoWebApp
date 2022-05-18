import axios from 'axios';
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_TODO } from "../types";
import setAuthToken from '../utils/setAuthToken';
import toast from "react-hot-toast";

//LOAD user
export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('http://localhost:5000/api/auth')
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

//Register user
export const register = ({ firstname, lastname, email, password }, cb) => async dispatch => {
    const config = {
        headers: { 'Content-Type': 'application/json' }
    };
    const body = JSON.stringify({ firstname, lastname, email, password });
    try {
        const res = await axios.post('http://localhost:5000/api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser());
        cb();
    } catch (error) {
        cb();
        toast.error(error.message);
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(error => {
                dispatch(toast.error(error.msg, { duration: 6000 }))
            });
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}

export const loginUser = ({email, password }, cb) => async dispatch => {
    const config = {
        headers: { 'Content-Type': 'application/json' }
    };
    const body = JSON.stringify({ email, password });
    try {
        const res = await axios.post('http://localhost:5000/api/auth', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser());
        cb();
    } catch (error) {
        cb();
        toast.error(error.message);
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(error => {
                dispatch(toast.error(error.msg, { duration: 6000 }))
            });
        }
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

//export logout
export const logout = () => dispatch => {
    dispatch({ type: CLEAR_TODO })
    dispatch({type: LOGOUT})
}