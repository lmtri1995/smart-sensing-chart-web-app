import React from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import CustomDateRangePicker from "../../DateTime/component/CustomDateRangePicker";

const ExampleCard = () => (
    <Col md={12}>
        <Card>
            <CardBody>
                <CustomDateRangePicker numWeeks={3}/>
            </CardBody>
        </Card>
    </Col>
);

export default ExampleCard;
