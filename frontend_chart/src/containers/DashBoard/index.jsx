import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import Dashboard from './components/Dashboard';

const DashboardPage = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title"> Dashboard Page</h3>
      </Col>
    </Row>
    <Row>
      <Dashboard />
    </Row>
  </Container>
);
export default DashboardPage;
