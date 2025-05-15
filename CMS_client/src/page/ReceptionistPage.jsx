import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Navbar,
  Nav,
  Dropdown,
  Alert,
} from "react-bootstrap";
import { logoutUser } from "../../axios/userAxios";

const ReceptionistPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.success) {
        localStorage.removeItem("user");
        navigate("/", { replace: true });
      } else {
        setError("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="vh-100 d-flex flex-column">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Header with Logout */}
      <Navbar bg="primary" variant="dark" className="px-3">
        <Navbar.Brand>Receptionist Dashboard</Navbar.Brand>
        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="text-white text-decoration-none"
            >
              Profile
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>

      {/* Main Content */}
      <Container fluid className="flex-grow-1 bg-light">
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
    </div>
  );
};

export default ReceptionistPage;
