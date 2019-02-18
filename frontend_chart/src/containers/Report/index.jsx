import React from 'react';
import DefectRate from './components/DefectRate';
import DefectRateOverview from './components/DefectRateOverview';

const ReportPage = () => (
  <div className="container report">
        <div className="row">
            <h3>Line 1111</h3>
        </div>
        <div className="row">

            <div className="col-9">
               <DefectRate />
            </div>
            <div className="col-3">
               <DefectRateOverview />
            </div>
        </div>
  </div>
);

export default ReportPage;
