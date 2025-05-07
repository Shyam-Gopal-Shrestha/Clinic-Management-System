import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaBell } from "react-icons/fa";
import {
  Row,
  Col,
  Navbar,
  Nav,
  ListGroup,
  Button,
  Dropdown,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { handleAddAvailability } from "../../axios/availabilityAxios"; // Import the function from availabilityAxios.js

function DoctorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [availability, setAvailability] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    date: new Date(),
    start: "",
    end: "",
  });
  const [userName, setUserName] = useState("");

  // Time slots options (every 30 minutes)
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  // Fetch the logged-in doctor's name and availability
  useEffect(() => {
    const fetchDoctorData = async () => {
      const name = localStorage.getItem("userName");
      const doctorId = localStorage.getItem("doctorId");

      if (name) {
        setUserName(name);
      }

      if (doctorId) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/availability/${doctorId}`
          );
          setAvailability(response.data);
        } catch (error) {
          console.error("Error fetching availability:", error);
        }
      }
    };

    fetchDoctorData();
  }, []);

  const handleAvailabilityChange = (e) => {
    setNewAvailability({ ...newAvailability, [e.target.name]: e.target.value });
  };

  const addAvailability = async () => {
    if (!newAvailability.start || !newAvailability.end) {
      alert("Please select both start and end times.");
      return;
    }

    try {
      await handleAddAvailability(
        newAvailability,
        setAvailability,
        setNewAvailability
      );
    } catch (error) {
      console.error("Error adding availability:", error);
      alert("Failed to add availability. Please try again.");
    }
  };

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Header */}
      <header
        className="d-flex align-items-center px-3"
        style={{
          height: "60px",
          backgroundColor: "#0056b3", // Blue for doctor dashboard
        }}
      >
        {/* Navbar Section */}
        <Navbar expand="lg" className="flex-grow-1 ms-3">
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link href="#" style={{ color: "#fff" }}>
              Hi, {userName}!
            </Nav.Link>
            <Nav.Link href="#" style={{ color: "#fff" }}>
              <FaBell style={{ marginRight: "5px" }} /> Notifications
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
      </header>

      {/* Main Section */}
      <div className="d-flex flex-grow-1" style={{ overflow: "hidden" }}>
        {/* Sidebar */}
        {isSidebarOpen && (
          <div
            className="bg-white border-end p-3"
            style={{
              width: "200px",
              height: "calc(100vh - 60px)", // Subtract the header height
              position: "fixed",
              top: "60px", // Align below the header
              left: "0",
              zIndex: "1000",
              backgroundColor: "#e9ecef", // Light gray for the sidebar
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Nav.Link href="#" className="fw-bold">
                Dashboard
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
              <Nav.Link href="#">Manage Appointments</Nav.Link>
              <Nav.Link href="#">Patient Records</Nav.Link>
              <Nav.Link href="#">Messages</Nav.Link>
              <Nav.Link href="#">Settings</Nav.Link>
            </Nav>
          </div>
        )}

        {/* Main body Content */}
        <div
          className="flex-grow-1 bg-light p-4 overflow-auto"
          style={{
            marginLeft: isSidebarOpen ? "200px" : "0", // Adjust content margin based on sidebar visibility
            height: "calc(100vh - 60px)", // Subtract the header height
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
                <h5>Upcoming Appointments</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    John Doe - 2025-05-10, 10:30 AM <a href="#">Details</a>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between bg-light">
                    Jane Smith - 2025-05-10, 11:00 AM <a href="#">Details</a>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    Alex Johnson - 2025-05-10, 11:30 AM <a href="#">Details</a>
                  </ListGroup.Item>
                </ListGroup>
              </div>

              <div className="bg-white p-3 rounded shadow-sm">
                <h5>Patient Messages</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    John Doe: "Need to reschedule my appointment."{" "}
                    <a href="#">Reply</a>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between bg-light">
                    Jane Smith: "Can I get my lab results?"{" "}
                    <a href="#">Reply</a>
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Col>

            <Col lg={4}>
              {/* Manage Availability Section */}
              <div className="bg-white p-3 rounded shadow-sm mb-4">
                <h5>Manage Availability</h5>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Date</Form.Label>
                    <Calendar
                      onChange={(selectedDate) =>
                        setNewAvailability({
                          ...newAvailability,
                          date: selectedDate,
                        })
                      }
                      value={newAvailability.date}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      as="select"
                      name="start"
                      value={newAvailability.start}
                      onChange={handleAvailabilityChange}
                    >
                      <option value="">Select Start Time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      as="select"
                      name="end"
                      value={newAvailability.end}
                      onChange={handleAvailabilityChange}
                    >
                      <option value="">Select End Time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Button variant="primary" onClick={addAvailability}>
                    Add Availability
                  </Button>
                </Form>

                <h6 className="mt-4">Current Availability</h6>
                <ListGroup>
                  {availability.map((slot, index) => (
                    <ListGroup.Item key={index}>
                      {new Date(slot.date).toDateString()}: {slot.start} -{" "}
                      {slot.end}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
