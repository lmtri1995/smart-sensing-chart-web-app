import ExamplePageOne from '../containers/Example/index';
import Report from '../containers/Report/index';
import ExamplePageThree from '../containers/ExampleThree/index';
import DashBoard from '../containers/DashBoard/index';
import Analysis from '../containers/Analysis/index';

const admin = [
    {component: DashBoard, route: "/", title: "Dashboard"},
    {component: ExamplePageOne, route: "/pages/one", title: "Page one"},
    {component: Report, route: "/pages/report", title: "Report"},
    {component: ExamplePageThree, route: "/pages/three", title: "Page three"},
    {component: Analysis, route: "/pages/analysis", title: "Analysis"},
];
const ip = [
    {component: DashBoard, route: "/pages/", title: "Page dashboard"},
    {component: Report, route: '/pages/report', title: "Report"},
    {component: ExamplePageThree, route: "/pages/three", title: "Page three"},
    {component: Analysis, route: "/pages/analysis", title: "Analysis"},
];
const os = [
    {component: DashBoard, route: "/pages/", title: "Page dashboard"},
    {component: Report, route: '/pages/report', title: "Report"},
    {component: ExamplePageThree, route: "/pages/three", title: "Page three"},
    {component: Analysis, route: "/pages/analysis", title: "Analysis"},
];
export const RoleList = {
    admin,
    ip,
    os,
};

