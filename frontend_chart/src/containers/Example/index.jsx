import React from 'react';
import {Col, Container, Row} from 'reactstrap';
import ExampleCardBarChartShort from "./components/ExampleCardBarChartShort";
import ExampleCardBarChartLong from "./components/ExampleCardBarChartLong";

const ExamplePage = () => (
    <Container className="dashboard">
        <Row>
            <Col md={12}>
                <h3 className="page-title">Example Page One</h3>
            </Col>
        </Row>
        <Row>
            <Col md={6} lg={6} xl={6}>
                <ExampleCardBarChartLong />
            </Col>
            <Col md={6} lg={6} xl={6}>
                <ExampleCardBarChartShort />
            </Col>
        </Row>
    </Container>
);
export default ExamplePage;
