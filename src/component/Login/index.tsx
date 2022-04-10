import React, {useEffect} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {LOGIN_GET_TOKEN, LOGIN_URL, SESSION_STORAGE_CURRENT_ROUTE_KEY, SESSION_STORAGE_TOKEN_KEY} from "../../constant";

const Login = () => {
    const [searchParams] = useSearchParams();
    const navigateFunction = useNavigate();
    useEffect(() => {
        const token = searchParams.get('token');
        if(token){
            sessionStorage.setItem(SESSION_STORAGE_TOKEN_KEY,token)
            const path = sessionStorage.getItem(SESSION_STORAGE_CURRENT_ROUTE_KEY);
            if(!path || !path.length){
                navigateFunction('/')
            }
            navigateFunction(path!)
        }else{
            window.location.replace(encodeURI(LOGIN_URL + LOGIN_GET_TOKEN))
        }
    },[])

    return (
        <></>
    );
};

export default Login;