import React from 'react';
import OEEChart from "./components/OOEChart";
import OEEPre from "./components/OEEPre";
import LossOfWork from "./components/LossOfWork";
import StationComparison from "./components/StationComparison";
import SwingArmMachine from "./components/SwingArmMachine";

const listBottomCom = () => (
    <div className="container">
        <div className="row">
            <div className="col">
                <div className="row">
                    <div className="col-9"><OEEChart/></div>
                    <div className="col-3"><OEEPre/></div>
                </div>
            </div>
            <div className="col">
                <div className="row">
                    <div className="col-3"><LossOfWork/></div>
                    <div className="col-9"><StationComparison/></div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-6">
                <SwingArmMachine/>
            </div>
            <div className="col-6">
                <SwingArmMachine/>
            </div>
        </div>

    </div>
);
export default listBottomCom;
