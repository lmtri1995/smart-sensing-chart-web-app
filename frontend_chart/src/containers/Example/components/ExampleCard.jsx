import React from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import ChartJS from "../../Charts/ChartJS/";

const ExampleCard = () => (
    <Col md={12}>
        <Card>
            <CardBody>
                <ChartJS/>
            </CardBody>
        </Card>
    </Col>
);

export default ExampleCard;
