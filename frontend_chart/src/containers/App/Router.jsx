import React, {Component} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';
import LogIn from '../LogIn/index';
import Report from '../Report/index';
import LogOut from '../LogOut/index';
import DashBoard from "../DashBoard/index";
import Analysis from "../Analysis/index";
import PrivateRoute from "./PrivateRoute";
import Fullscreen from "react-full-screen";
import {ROUTE} from "../../constants/constants";

class Pages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFull: false,
        };
    }

    goFull = () => {
        this.setState({isFull: !this.state.isFull});
    };

    render() {
        let loginData = JSON.parse(localStorage.getItem('logindata'));
        return (
            <div>
                <Fullscreen
                    enabled={this.state.isFull}
                    onChange={isFull => this.setState({isFull})}
                >
                    {
                        loginData ? <Layout goFull={this.goFull}/> : null
                    }
                    <div className="container__wrap">
                        <Switch>
                            <PrivateRoute exact path={ROUTE.Dashboard} component={DashBoard}/>
                            <PrivateRoute path={ROUTE.Analysis} component={Analysis}/>
                            {/* <PrivateRoute path="/pages/one" component={ExamplePageOne}/> */}
                            <PrivateRoute path={ROUTE.Report} component={Report}/>
                        </Switch>
                    </div>
                </Fullscreen>
            </div>
        )
    }
}

// const Pages = (goFull) => (

//         <div>
//             <Layout goFull={this.goFull}/>
//             <div className="container__wrap">
//                 <Switch>
//                     <PrivateRoute exact path={ROUTE.Dashboard} component={DashBoard}/>
//                     <PrivateRoute path={ROUTE.Analysis} component={Analysis}/>
//                     {/* <PrivateRoute path="/pages/one" component={ExamplePageOne}/> */}
//                     <PrivateRoute path={ROUTE.Report} component={Report}/>
//                     <PrivateRoute path="/pages/three" component={ExamplePageThree}/>
//                 </Switch>
//             </div>
//         </div>
// );

const wrappedRoutes = () => (
    console.log('wrappedRoutes'),
        <Switch>
            <Route exact path={ROUTE.Dashboard} component={Pages}/>
            <Route exact path={ROUTE.Login} render={(props) => (
                JSON.parse(localStorage.getItem('logindata')) === null
                    ? <LogIn/>
                    : <Redirect to={ROUTE.Dashboard}/>
            )}/>
            <Route exact path={ROUTE.Logout} component={LogOut}/>
            <Route path={ROUTE.Pages} render={(props) => (
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
                <Route path={ROUTE.Dashboard} component={wrappedRoutes}/>
            </main>
        </MainWrapper>
    );
};
export default withRouter(Router)

