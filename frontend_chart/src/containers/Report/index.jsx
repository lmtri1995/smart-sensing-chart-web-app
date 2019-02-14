import React from 'react';
import ProductionRate from './components/ProductionRate';
import ProductionRateOverview from './components/ProductionRateOverview';

const ReportPage = () => (
  <div className="container report">
        <div className="row">
            <h3>Line 1111</h3>
        </div>
        <div className="row">

            <div className="col-9">
               <ProductionRate />
            </div>
            <div className="col-3">
               <ProductionRateOverview />
            </div>
        </div>
  </div>
);

export default ReportPage;
