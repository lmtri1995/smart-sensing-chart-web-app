import React, {Component} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';
import LogIn from '../LogIn/index';
import Report from '../Report/index';
import ExamplePageThree from '../ExampleThree/index';
import LogOut from '../LogOut/index';
import DashBoard from "../DashBoard/index";
import Analysis from "../Analysis/index";
import PrivateRoute from "./PrivateRoute";
import Fullscreen from "react-full-screen";

class Pages extends Component {
    constructor(props) {
        super();

        this.state = {
            isFull: false,
        };
    }

    goFull = () => {
        this.setState({isFull: !this.state.isFull});
    };

    render() {
        return (
            <div>
                <Fullscreen
                    enabled={this.state.isFull}
                    onChange={isFull => this.setState({isFull})}
                >
                    <Layout goFull={this.goFull}/>
                    <div className="container__wrap">
                        <Switch>
                            <PrivateRoute exact path="/" component={DashBoard}/>
                            <PrivateRoute path="/pages/analysis" component={Analysis}/>
                            {/* <PrivateRoute path="/pages/one" component={ExamplePageOne}/> */}
                            <PrivateRoute path="/pages/report" component={Report}/>
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
//                     <PrivateRoute exact path="/" component={DashBoard}/>
//                     <PrivateRoute path="/pages/analysis" component={Analysis}/>
//                     {/* <PrivateRoute path="/pages/one" component={ExamplePageOne}/> */}
//                     <PrivateRoute path="/pages/report" component={Report}/>
//                     <PrivateRoute path="/pages/three" component={ExamplePageThree}/>
//                 </Switch>
//             </div>
//         </div>
// );

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

