import React from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";

const ReceptionistPage = () => {
  return (
    <Container fluid className="vh-100 bg-light">
      <Row className="py-3 bg-primary text-white">
        <Col>
          <h1 className="text-center">Receptionist Dashboard</h1>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4} className="p-3 bg-white shadow-sm rounded">
          <h4>Quick Actions</h4>
          <Button variant="success" className="w-100 mb-3">
            Add New Appointment
          </Button>
          <Button variant="info" className="w-100 mb-3">
            View Patient Records
          </Button>
          <Button variant="warning" className="w-100">
            Manage Schedules
          </Button>
        </Col>

        <Col md={8} className="p-3 bg-white shadow-sm rounded">
          <h4>Upcoming Appointments</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>John Doe</td>
                <td>Dr. Smith</td>
                <td>2025-05-10</td>
                <td>10:30 AM</td>
                <td>
                  <Button variant="primary" size="sm" className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">
                    Cancel
                  </Button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jane Smith</td>
                <td>Dr. Brown</td>
                <td>2025-05-10</td>
                <td>11:00 AM</td>
                <td>
                  <Button variant="primary" size="sm" className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">
                    Cancel
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ReceptionistPage;
