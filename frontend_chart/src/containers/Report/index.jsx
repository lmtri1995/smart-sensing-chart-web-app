import React from 'react';
import DefectRate from './components/DefectRate';
import DefectRateOverview from './components/DefectRateOverview';

const ReportPage = () => (
  <div className="container report">
        <div className="row">
            
            <div className="col-10">
                <h3>Line 1111</h3>
            </div>
            <div className="col-2">
                <div class="btn-group" >
                    <button type="button" class="btn btn-primary">Productivity</button>
                    <button type="button" class="btn btn-secondary">Defect</button>
                </div>
            </div>
            
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
