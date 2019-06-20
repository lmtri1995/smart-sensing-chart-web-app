//import ExamplePageOne from '../containers/Example/index';
import Report from '../containers/Report/index';
import ExamplePageThree from '../containers/ExampleThree/index';
import DashBoard from '../containers/DashBoard/index';
import Analysis from '../containers/Analysis/index';
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
export const RoleList = {
    admin,
    ip,
    os,
};

