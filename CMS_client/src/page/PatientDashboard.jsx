import React, { useState } from "react";
import logo from "../assets/logo.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaBell } from "react-icons/fa"; // Import the notification icon
import { Link } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  ListGroup,
  Button,
  Dropdown,
} from "react-bootstrap";

function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Header */}
      <header
        className="d-flex align-items-center px-3"
        style={{
          height: "60px",
          backgroundColor: "#10898D",
        }}
      >
        <Col>
          {/* Navbar Section */}
          <Navbar expand="lg" className="flex-grow-1 ms-3">
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Link
                as={Link}
                to="/book-appointment"
                style={{ color: "#fff" }}
              >
                Book Appointment
              </Nav.Link>
              <Nav.Link href="#" style={{ color: "#fff" }}>
                <FaBell style={{ marginRight: "5px" }} /> Notification
              </Nav.Link>
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="text-decoration-none"
                  style={{ color: "#fff" }}
                >
                  Profile
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">Update Profile</Dropdown.Item>
                  <Dropdown.Item href="#">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar>
        </Col>
      </header>

      {/* Main Section */}
      <div className="d-flex flex-grow-1" style={{ overflow: "hidden" }}>
        {/* Sidebar */}
        {isSidebarOpen && (
          <div
            className="bg-white border-end p-3"
            style={{
              width: "200px",
              height: "calc(100vh - 80px)", // Subtract the header height
              position: "fixed",
              top: "80px", // Align below the header
              left: "0",
              zIndex: "1000",
              backgroundColor: "#d4edda", // Light green for the sidebar
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Nav.Link href="#" className="fw-bold">
                Home
              </Nav.Link>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
              >
                ×
              </Button>
            </div>
            <Nav className="flex-column">
              <Nav.Link href="#">Appointments</Nav.Link>
              <Nav.Link href="#">Prescriptions</Nav.Link>
              <Nav.Link href="#">Lab Reports</Nav.Link>
              <Nav.Link href="#">Billing</Nav.Link>
              <Nav.Link href="#">Settings</Nav.Link>
            </Nav>
          </div>
        )}

        {/* Main body Content */}
        <div
          className="flex-grow-1 bg-light p-4 overflow-auto"
          style={{
            marginLeft: isSidebarOpen ? "200px" : "0", // Adjust content margin based on sidebar visibility
            height: "calc(100vh - 80px)", // Subtract the header height
            paddingTop: "20px",
            paddingBottom: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
            backgroundColor: "#fff9cd", // Light yellow for the main body
          }}
        >
          {/* Hamburger when sidebar is collapsed */}
          {!isSidebarOpen && (
            <div className="mb-3">
              <Button
                variant="outline-primary"
                onClick={() => setIsSidebarOpen(true)}
              >
                ☰ Menu
              </Button>
            </div>
          )}

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

            {/* Right Calendar and Message Features */}
            <Col lg={4}>
              <div className="bg-white p-3 rounded shadow-sm mb-4">
                <h5>Select a Date</h5>
                <Calendar onChange={setDate} value={date} />
                <p className="mt-3">
                  Selected: <strong>{date.toDateString()}</strong>
                </p>
              </div>

              <div className="bg-white p-3 rounded shadow-sm">
                <h5>Send a Message</h5>
                <form>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="form-control"
                      rows="4"
                      placeholder="Type your message here..."
                    ></textarea>
                  </div>
                  <Button variant="primary" type="submit">
                    Send
                  </Button>
                </form>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
