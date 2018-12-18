import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';

const Dashboard= () => (
  <Col md={12}>
    <Card>
      <CardBody>
        <div className="card__title">
          <h5 className="bold-text">Dashboard title</h5>
          <h5 className="subhead">Dashboard subhead</h5>
        </div>
        <p>Your content here</p>
      </CardBody>
    </Card>
  </Col>
);

export default Dashboard;
