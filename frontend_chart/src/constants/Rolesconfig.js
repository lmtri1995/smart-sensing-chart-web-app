import ExamplePageOne from '../containers/Example/index';
import ExamplePageTwo from '../containers/ExampleTwo/index';
import DashBoard from '../containers/DashBoard/index';
import Analysis from '../containers/Analysis/index';

const admin = [
    {component: DashBoard, route: "/", title: "Dashboard"},
    {component: ExamplePageOne, route: "/pages/one", title: "Page one"},
    {component: ExamplePageTwo, route: "/pages/two", title: "Page two"},
    {component: Analysis, route: "/pages/analysis", title: "Analysis"},
];
const ip = [
    {component: DashBoard, route: "/pages/", title: "Page dashboard"},
    {component: ExamplePageTwo, route: '/pages/two', title: "Page two"},
    {component: Analysis, route: "/pages/analysis", title: "Analysis"},
];
const os = [
    {component: DashBoard, route: "/pages/", title: "Page dashboard"},
    {component: ExamplePageTwo, route: '/pages/two', title: "Page two"},
    {component: Analysis, route: "/pages/analysis", title: "Analysis"},
];
export const RoleList = {
    admin,
    ip,
    os,
};

