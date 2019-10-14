import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';

import LogIn              from '../LogIn/index';
import MasterPage         from '../MasterPage/index';
import MasterAlarm        from "../MasterAlarm/index";
import MappingStitch        from "../MappingStitch/index";
import LeadTime           from "../LeadTime/index";
import LeadTimeDetail     from "../LeadTimeDetail/index";
import AlarmHistory from "../AlarmHistory/index";
import MachineAlarmStatus from "../MachineAlarmStatus/index";
import SensingValue from "../SensingValue/index";
import LearningCurve from "../LearningCurve/index";
import DefectStatus from "../DefectStatus/index";
import DefectSummary from "../DefectSummary/index";
import Overview from "../Overview/index";

const Pages = () => (
	<Switch>
		<Route path="/pages/master-page" component={MasterPage} />
		<Route path="/pages/alarm-master" component={MasterAlarm} />
		<Route path="/pages/mapping-stitch" component={MappingStitch} />
		<Route path="/pages/lead-time" component={LeadTime} />
		<Route path="/pages/lead-time-detail" component={LeadTimeDetail} />
		<Route path="/pages/alarm-history" component={AlarmHistory} />
		<Route path="/pages/machine-alarm-status" component={MachineAlarmStatus} />
		<Route path="/pages/sensing-value" component={SensingValue} />
		<Route path="/pages/learning-curve" component={LearningCurve} />
		<Route path="/pages/defect-status" component={DefectStatus} />
		<Route path="/pages/defect-summary" component={DefectSummary} />
		<Route path="/pages/overview" component={Overview} />
	</Switch>
);

const wrappedRoutes = () => (
<div>
<Layout />
<div className="container__wrap">
  <Route path="/pages" component={Pages} />
</div>
</div>
);

const Router = () => (
<MainWrapper>
<main>
  <Switch>
	<Route exact path="/" component={LogIn} />
	<Route exact path="/log_in" component={LogIn} />
	<Route path="/" component={wrappedRoutes} />
  </Switch>
</main>
</MainWrapper>
);

export default Router;
