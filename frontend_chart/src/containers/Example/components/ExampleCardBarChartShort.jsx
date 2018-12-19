import React from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import RandomAnimatedBarsShort from "../../Charts/ChartJS/components/RandomAnimatedBarsShort";

const ExampleCardBarChartShort = () => (
    <Col md={12}>
        <Card>
            <CardBody>
                <RandomAnimatedBarsShort/>
            </CardBody>
        </Card>
    </Col>
);

export default ExampleCardBarChartShort;
