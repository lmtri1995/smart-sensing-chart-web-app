import React from 'react';
import OEEChart from "./components/OEEChart";
import OEEGeneral from "./components/OEEGeneral";
import LossOfWork from "./components/LossOfWork";
import CycleDefectStationComparison from "./components/CycleDefectStationComparison";
import SwingArmMachine from "./components/SwingArmMachine";
import SwingOSStationComparison from "./components/SwingOSStationComparison";

const listBottomComponent = () => (
    <div className="container">
        <div className="row">
            <div className="col">
                <div className="row">
                    <div className="col-9"><OEEChart/></div>
                    <div className="col-3"><OEEGeneral/></div>
                </div>
            </div>
            <div className="col">
                <div className="row">
                    <div className="col-3"><LossOfWork/></div>
                    <div className="col-9"><CycleDefectStationComparison/></div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-6">
                <SwingArmMachine/>
            </div>
            <div className="col-6">
                <SwingOSStationComparison/>
            </div>
        </div>

    </div>
);
export default listBottomComponent;
