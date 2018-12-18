import React from 'react';
import { Redirect } from "react-router-dom";
const index = () => {
    console.log('logout')
    localStorage.removeItem('logindata')
    return <Redirect to='/login' />
};

export default index;