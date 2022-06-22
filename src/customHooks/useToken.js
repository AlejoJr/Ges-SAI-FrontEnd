import {useState} from 'react';

function useToken() {

    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken?.token
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
    };

    return {
        setToken: saveToken,
        token,
    }
}

function useIsTechnical() {

    const getIsTechnical = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken?.is_superuser
    };

    const [isTechnical, setIsTechnical] = useState(getIsTechnical());

    const saveIsTechnical = userToken => {
        localStorage.setItem('is_superuser', JSON.stringify(userToken));
        setIsTechnical(userToken.is_superuser);
    };

    return {
        setIsTechnical: saveIsTechnical,
        isTechnical,
    }
}

export {useToken, useIsTechnical}