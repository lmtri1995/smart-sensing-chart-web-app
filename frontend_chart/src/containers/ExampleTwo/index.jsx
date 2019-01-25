import React from 'react';
import {Col, Container, Row} from 'reactstrap';
import ExampleCard from './components/ExampleCard';
import DataExporter, {ExportType} from "../DataExporter/component/DataExporter";

const TestData = [
    {
        Target: 14,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 390.81,
        cur_stdev: 217.65,
        first_shift: "0",
        idLine: "1039",
        idStation: "1",
        iddata: 756578,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 591.65,
        temp_stdev: 171.76,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 13,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 354.01,
        cur_stdev: 237.16,
        first_shift: "0",
        idLine: "1039",
        idStation: "2",
        iddata: 836579,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 568.17,
        temp_stdev: 178.87,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 0,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 352.94,
        cur_stdev: 236.53,
        first_shift: "0",
        idLine: "1039",
        idStation: "3",
        iddata: 836578,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 555.82,
        temp_stdev: 202.67,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 13,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 353.65,
        cur_stdev: 237.12,
        first_shift: "0",
        idLine: "1039",
        idStation: "4",
        iddata: 836577,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 662.03,
        temp_stdev: 26.47,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 12,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 352.72,
        cur_stdev: 236.56,
        first_shift: "0",
        idLine: "1039",
        idStation: "5",
        iddata: 836582,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 657.39,
        temp_stdev: 24.85,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 13,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 351.88,
        cur_stdev: 236.08,
        first_shift: "0",
        idLine: "1039",
        idStation: "6",
        iddata: 836581,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 659.37,
        temp_stdev: 26.96,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 13,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 351.92,
        cur_stdev: 236.08,
        first_shift: "0",
        idLine: "1039",
        idStation: "7",
        iddata: 836574,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 658.71,
        temp_stdev: 23.67,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 13,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 350.69,
        cur_stdev: 235.05,
        first_shift: "0",
        idLine: "1039",
        idStation: "8",
        iddata: 836573,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 657.94,
        temp_stdev: 24.55,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
];

const ExamplePage = () => (
    <Container className="dashboard">
        <Row>
            <Col md={12}>
                <h3 className="page-title">Example Page Two</h3>
            </Col>
        </Row>
        <Row>
            <ExampleCard/>
        </Row>
        <Row>
            <DataExporter exportType={ExportType.EXCEL}
                          data={TestData}/>
            <DataExporter exportType={ExportType.PDF}/>
            <DataExporter exportType={ExportType.PNG}/>
        </Row>
    </Container>
);

export default ExamplePage;
