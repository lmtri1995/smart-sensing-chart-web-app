//import ExamplePageOne from '../containers/Example/index';
import IPReport             from '../containers/IP/Report/index';
import OSReport             from '../containers/OS/Report/index';
import ExamplePageThree   from '../containers/ExampleThree/index';
import IPDashBoard          from '../containers/IP/DashBoard/index';
import OSDashBoard          from '../containers/OS/DashBoard/index';
import IPAnalysis           from '../containers/IP/Analysis/index';
import OSAnalysis           from '../containers/OS/Analysis/index';
import MasterPage         from '../Assembly/containers/MasterPage/index';
import MasterAlarm        from '../Assembly/containers/MasterAlarm/index';
import MappingStitch      from '../Assembly/containers/MappingStitch/index';
import LeadTime           from '../Assembly/containers/LeadTime/index';
import LeadTimeDetail     from '../Assembly/containers/LeadTimeDetail/index';
import AlarmHistory       from '../Assembly/containers/AlarmHistory/index';
import MachineAlarmStatus from '../Assembly/containers/MachineAlarmStatus/index';
import SensingValue       from '../Assembly/containers/SensingValue/index';
import LearningCurve from '../Assembly/containers/LearningCurve/index';
import DefectStatus from '../Assembly/containers/DefectStatus/index';
import DefectSummary from '../Assembly/containers/DefectSummary/index';
import Overview from '../Assembly/containers/Overview/index';
import {ROUTE} from "./constants";

const admin = [
    {component: IPDashBoard, route: ROUTE.IPDashboard, title: "Dashboard"},
    {component: IPReport, route: ROUTE.IPReport, title: "Report"},
    {component: IPAnalysis, route: ROUTE.IPAnalysis, title: "Analysis"},
];
const ip = [
    {component: IPDashBoard, route: ROUTE.IPDashboard, title: "Page dashboard"},
    {component: IPReport, route: ROUTE.IPReport, title: "Report"},
    {component: IPAnalysis, route: ROUTE.IPAnalysis, title: "Analysis"},
];
const os = [
    {component: OSDashBoard, route: ROUTE.OSDashboard, title: "Page dashboard"},
    {component: OSReport, route: ROUTE.OSReport, title: "Report"},
    {component: OSAnalysis, route: ROUTE.OSAnalysis, title: "Analysis"},
];
const as = [
    {component: MasterPage, route: ROUTE.MasterPage, title: "Master Page"},
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
const all = [
    ...ip,
    ...os,
    ...as
];
export const RoleList = {
    admin,
    ip,
    os,
    as,
    all
};

