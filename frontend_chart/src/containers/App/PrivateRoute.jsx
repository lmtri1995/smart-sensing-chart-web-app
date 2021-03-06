import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {RoleList} from "../../constants/Rolesconfig";
import {ROUTE} from "../../constants/constants";

const PrivateRoute = ({component: Component, value = JSON.parse(localStorage.getItem('logindata')), ...rest}) => (

    // console.log('==',RoleList[value.data.role].findIndex(i => i.component === Component)),
    console.log('PrivateRoute'),
        <Route {...rest} render={(props) => (
            value != null && value.token !== undefined && RoleList[value.data.role].findIndex(i => i.component === Component) != -1
                ? <Component {...props} />
                : <Redirect
                    to={ROUTE.Login}/>
        )}/>
);
export default PrivateRoute;
