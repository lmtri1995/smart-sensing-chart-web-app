import React from 'react';
import {Redirect} from "react-router-dom";
import Singleton from "../../services/Socket";

const index = () => {
    console.log('logout');
    let loginData = JSON.parse(localStorage.getItem('logindata'));
    let token = loginData ? loginData.token : null;
    console.log("token: ", token);
    if (token) {
        let socket = Singleton.getInstance(token);
        console.log("socket: ", socket);
        socket.disconnect();
    }
    localStorage.removeItem('logindata');
    return <Redirect to='/login'/>
};

export default index;
