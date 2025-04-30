import React, { useState } from "react";
import logo from "../assets/logo.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { Container, Row, Col, Navbar, Nav, ListGroup } from "react-bootstrap";

function Dashboard() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="shadow-sm px-4">
        <Navbar.Brand href="#" className="d-flex align-items-center gap-2">
          <img
            src={logo}
            alt="Clinic Logo"
            style={{ width: "100px", height: "100px", objectFit: "contain" }}
          />
          <span className="ms-2 fw-bold">Clinic Management System</span>
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link href="#">Dashboard</Nav.Link>
          <Nav.Link href="#">Book Appointment</Nav.Link>
          <Nav.Link href="#">Notification</Nav.Link>
          <Nav.Link href="#">Message</Nav.Link>
          <Nav.Link href="#">Profile</Nav.Link>
          <Nav.Link href="#">Logout</Nav.Link>
        </Nav>
      </Navbar>

      {/* Main Layout */}
      <Container fluid className="flex-grow-1 px-0">
        <Row className="h-100">
          {/* Sidebar */}
          <Col md={2} className="bg-white border-end p-3">
            <Nav className="flex-column">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Appointments</Nav.Link>
              <Nav.Link href="#">Prescriptions</Nav.Link>
              <Nav.Link href="#">Lab Reports</Nav.Link>
              <Nav.Link href="#">Billing</Nav.Link>
              <Nav.Link href="#">Settings</Nav.Link>
            </Nav>
          </Col>

          {/* Main Content Area */}
          <Col md={10} className="bg-light p-4">
            <Row>
              {/* Left Content */}
              <Col lg={8}>
                <div className="bg-white p-3 mb-4 rounded shadow-sm">
                  <p className="mb-1">
                    Your next appointment: <strong>2025-05-10</strong> with Dr.
                    Anjali Thapa
                  </p>
                  <p className="mb-0">
                    <strong>Appointment Details:</strong>
                  </p>
                  <p className="mb-0">Standard Consultation at 10:30 am</p>
                  <p className="mb-0">XYZ Clinic Service</p>
                  <p>1/1 Kings Street, ACT 1901</p>
                  <a href="#" className="fw-bold text-decoration-underline">
                    Reschedule Appointment
                  </a>
                </div>

                <div className="bg-white p-3 rounded shadow-sm">
                  <h5>Appointment History</h5>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between">
                      Dr. Sujan Prajapati on 2025-4-25, 2:30 pm{" "}
                      <a href="#">Details</a>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between bg-light">
                      Dr. Shalu Pokhrel on 2025-4-13, 4:45 pm{" "}
                      <a href="#">Details</a>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      Dr. Anjali Thapa on 2025-4-10, 10:30 am{" "}
                      <a href="#">Details</a>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between bg-light">
                      Dr. Aditya on 2025-4-01, 5:30 pm <a href="#">Details</a>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              </Col>

              {/* Right Calendar */}
              <Col lg={4}>
                <div className="bg-white p-3 rounded shadow-sm">
                  <h5>Select a Date</h5>
                  <Calendar onChange={setDate} value={date} />
                  <p className="mt-3">
                    Selected: <strong>{date.toDateString()}</strong>
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
