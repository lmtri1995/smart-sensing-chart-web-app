//import ExamplePageOne from '../containers/Example/index';
import Report from '../containers/Report/index';
import ExamplePageThree from '../containers/ExampleThree/index';
import DashBoard from '../containers/DashBoard/index';
import Analysis from '../containers/Analysis/index';
import MasterPage from '../Assembly/containers/MasterPage/index';
import MasterAlarm from '../Assembly/containers/MasterAlarm/index';
import MappingStitch from '../Assembly/containers/MappingStitch/index';
import LeadTime from '../Assembly/containers/LeadTime/index';
import LeadTimeDetail from '../Assembly/containers/LeadTimeDetail/index';
import AlarmHistory from '../Assembly/containers/AlarmHistory/index';
import MachineAlarmStatus from '../Assembly/containers/MachineAlarmStatus/index';
import SensingValue from '../Assembly/containers/SensingValue/index';
import LearningCurve from '../Assembly/containers/LearningCurve/index';
import DefectStatus from '../Assembly/containers/DefectStatus/index';
import DefectSummary from '../Assembly/containers/DefectSummary/index';
import Overview from '../Assembly/containers/Overview/index';
import {ROUTE} from "./constants";

const admin = [
    {component: DashBoard, route: ROUTE.Dashboard, title: "Dashboard"},
    {component: Report, route: ROUTE.Report, title: "Report"},
    {component: Analysis, route: ROUTE.Analysis, title: "Analysis"},
];
const ip = [
    {component: DashBoard, route: ROUTE.Dashboard, title: "Page dashboard"},
    {component: Report, route: ROUTE.Report, title: "Report"},
    {component: Analysis, route: ROUTE.Analysis, title: "Analysis"},
];
const os = [
    {component: DashBoard, route: ROUTE.Dashboard, title: "Page dashboard"},
    {component: Report, route: ROUTE.Report, title: "Report"},
    {component: Analysis, route: ROUTE.Analysis, title: "Analysis"},
];
const as = [
    {component: MasterPage, route: ROUTE.Dashboard, title: "Master Page"},
    {component: MasterAlarm, route: ROUTE.AlarmMaster, title: "Alarm Master"},
    {component: MappingStitch, route: ROUTE.MappingStitch, title: "Mapping Arduino Stitch"},
    {component: LeadTime, route: ROUTE.LeadTime, title: "Lead Time"},
    {component: LeadTimeDetail, route: ROUTE.LeadTimeDetail, title: "Lead Time Detail"},
    {component: AlarmHistory, route: ROUTE.AlarmHistory, title: "Alarm History"},
    {component: MachineAlarmStatus, route: ROUTE.MachineAlarmStatus, title: "Machine Alarm Status"},
    {component: SensingValue, route: ROUTE.SensingValue, title: "Sensing Value"},
    {component: LearningCurve, route: ROUTE.LearningCurve, title: "Learning Curve"},
    {component: DefectStatus, route: ROUTE.DefectStatus, title: "Defect Status"},
    {component: DefectSummary, route: ROUTE.DefectSummary, title: "Defect Summary"},
    {component: Overview, route: ROUTE.Overview, title: "Overview"},
];
export const RoleList = {
    admin,
    ip,
    os,
    as
};

