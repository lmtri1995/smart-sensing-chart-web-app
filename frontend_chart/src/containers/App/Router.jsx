import React, {Component}                    from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import Layout                                from '../Layout/index';
import MainWrapper                           from './MainWrapper';
import LogIn                                 from '../LogIn/index';
import IPReport                                from '../IP/Report/index';
import OSReport                                from '../OS/Report/index';
import LogOut                                from '../LogOut/index';
import IPDashBoard                             from "../IP/DashBoard/index";
import OSDashBoard                             from "../OS/DashBoard/index";
import IPAnalysis                              from "../IP/Analysis/index";
import OSAnalysis                              from "../OS/Analysis/index";
/*import Assembly                              from "../../Assembly/index";*/
import PrivateRoute                          from "./PrivateRoute";
import Fullscreen                            from "react-full-screen";
import {ROUTE}                               from "../../constants/constants";
import MasterPage                            from "../../Assembly/containers/MasterPage";
import MasterAlarm                           from "../../Assembly/containers/MasterAlarm";
import MappingStitch                         from "../../Assembly/containers/MappingStitch";
import LeadTime                              from "../../Assembly/containers/LeadTime";
import LeadTimeDetail                        from "../../Assembly/containers/LeadTimeDetail";
import AlarmHistory   from "../../Assembly/containers/AlarmHistory";
import MachineAlarmStatus   from "../../Assembly/containers/MachineAlarmStatus";
import SensingValue   from "../../Assembly/containers/SensingValue";
import LearningCurve   from "../../Assembly/containers/LearningCurve";
import DefectStatus   from "../../Assembly/containers/DefectStatus";
import DefectSummary   from "../../Assembly/containers/DefectSummary";
import Overview   from "../../Assembly/containers/Overview";

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
                            <PrivateRoute exact path={ROUTE.Dashboard} component={Overview}/>
                            <PrivateRoute exact path={ROUTE.IPDashboard} component={IPDashBoard}/>
                            <PrivateRoute path={ROUTE.IPAnalysis} component={IPAnalysis}/>
                            <PrivateRoute path={ROUTE.IPReport} component={IPReport}/>
                            <PrivateRoute exact path={ROUTE.OSDashboard} component={OSDashBoard}/>
                            <PrivateRoute path={ROUTE.OSAnalysis} component={OSAnalysis}/>
                            <PrivateRoute path={ROUTE.OSReport} component={OSReport}/>
                            <PrivateRoute exact path={ROUTE.MasterPage} component={MasterPage}/>
                            <PrivateRoute path={ROUTE.AlarmMaster} component={MasterAlarm}/>
                            <PrivateRoute path={ROUTE.MappingStitch} component={MappingStitch}/>
                            <PrivateRoute path={ROUTE.LeadTime} component={LeadTime}/>
                            <PrivateRoute path={ROUTE.LeadTimeDetail} component={LeadTimeDetail}/>
                            <PrivateRoute path={ROUTE.AlarmHistory} component={AlarmHistory}/>
                            <PrivateRoute path={ROUTE.MachineAlarmStatus} component={MachineAlarmStatus}/>
                            <PrivateRoute path={ROUTE.SensingValue} component={SensingValue}/>
                            <PrivateRoute path={ROUTE.LearningCurve} component={LearningCurve}/>
                            <PrivateRoute path={ROUTE.DefectStatus} component={DefectStatus}/>
                            <PrivateRoute path={ROUTE.DefectSummary} component={DefectSummary}/>
                            <PrivateRoute path={ROUTE.Overview} component={Overview}/>
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

const wrappedRoutes = () => {
    let pageRedirect = ROUTE.Overview;
    return (<Switch>
        <Route exact path={ROUTE.Dashboard} component={Pages}/>
        <Route exact path={ROUTE.Login} render={(props) => (
            JSON.parse(localStorage.getItem('logindata')) === null
            ? <LogIn/>
            : <Redirect to={pageRedirect}/>
        )}/>
        <Route exact path={ROUTE.Logout} component={LogOut}/>
        <Route path={ROUTE.Pages} render={(props) => (
            JSON.parse(localStorage.getItem('logindata')) === null
            ? <LogIn/>
            : <Pages/>
        )}/>
    </Switch>);
}


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

