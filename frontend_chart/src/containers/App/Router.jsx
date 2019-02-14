import React from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';
import LogIn from '../LogIn/index';
import ExamplePageOne from '../Example/index';
import Report from '../Report/index';
import LogOut from '../LogOut/index';
import DashBoard from "../DashBoard/index";
import Analysis from "../Analysis/index";
import PrivateRoute from "./PrivateRoute";

const Pages = () => (
    console.log('Pages'),
        <div>
            <Layout/>
            <div className="container__wrap">
                <Switch>
                    <PrivateRoute exact path="/" component={DashBoard}/>
                    <PrivateRoute path="/pages/analysis" component={Analysis}/>
                    <PrivateRoute path="/pages/one" component={ExamplePageOne}/>
                    <PrivateRoute path="/pages/report" component={Report}/>
                </Switch>
            </div>
        </div>
);

const wrappedRoutes = () => (
    console.log('wrappedRoutes'),
        <Switch>
            <Route exact path="/" component={Pages}/>
            <Route exact path="/login" render={(props) => (
                JSON.parse(localStorage.getItem('logindata')) === null
                    ? <LogIn/>
                    : <Redirect to="/"/>
            )}/>
            <Route exact path="/logout" component={LogOut}/>
            )} />
            <Route path="/pages" render={(props) => (
                JSON.parse(localStorage.getItem('logindata')) === null
                    ? <LogIn/>
                    : <Pages/>
            )}/>
        </Switch>
);

const Router = () => {
    return (
        <MainWrapper>
            <main>
                <Route path="/" component={wrappedRoutes}/>
            </main>
        </MainWrapper>
    );
};
export default withRouter(Router)

