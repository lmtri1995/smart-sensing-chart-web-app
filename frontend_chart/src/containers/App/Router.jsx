import React, { Component } from 'react';
import { Route, Switch,withRouter,Redirect } from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';
import LogIn from '../LogIn/index';
import ExamplePageOne from '../Example/index';
import ExamplePageTwo from '../ExampleTwo/index';
import LogOut from '../LogOut/index';
import DashBoard from "../DashBoard/index";
import PrivateRoute from "./PrivateRoute";

const Pages = () => (
  console.log('Pages'),
  <div>
    <Layout />
    <div className="container__wrap">
  <Switch>
    <PrivateRoute exact path="/" component={DashBoard} />
    <PrivateRoute   path="/pages/one" component={ExamplePageOne} />
    <PrivateRoute   path="/pages/two" component={ExamplePageTwo} />
  </Switch>
  </div>
  </div>
);

const wrappedRoutes = () => (
  console.log('wrappedRoutes'),
    <Switch>
      <Route exact path="/" component={Pages} />
      <Route exact path="/login" render={(props) => (
                JSON.parse(localStorage.getItem('logindata')) === null
                  ? <LogIn />
                  : <Redirect to="/"/>
              )} />
      <Route exact path="/logout" component={LogOut} />
              )} />        
      <Route  path="/pages" render={(props) => (
                JSON.parse(localStorage.getItem('logindata')) === null
                  ? <LogIn />
                  : <Pages />
              )}/>                
    </Switch>
);

const Router = () => {
  return (
    <MainWrapper>
        <main>
          <Route  path="/" component={wrappedRoutes} />   
      </main>
    </MainWrapper>
  );
};
export default withRouter (Router)

