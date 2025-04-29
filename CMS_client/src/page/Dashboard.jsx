import React from "react";
import logo from "../assets/logo.png";

import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  ListGroup,
} from "react-bootstrap";

function Dashboard() {
  return (
    <>
      <div className="vh-100 d-flex flex-column">
        <Navbar bg="light" expand="lg" className="shadow-sm px-4">
          <Navbar.Brand href="#" className="d-flex align-items-center gap-2">
            <img
              src={logo}
              alt="Clinic Logo"
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
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
              <div className="text-center mb-4">
                <div className="mt-2 small">Clinic Management System</div>
              </div>
              <Nav className="flex-column">
                <Nav.Link href="#">Home</Nav.Link>
                <Nav.Link href="#">Appointments</Nav.Link>
                <Nav.Link href="#">Prescriptions</Nav.Link>
                <Nav.Link href="#">Lab Reports</Nav.Link>
                <Nav.Link href="#">Billing</Nav.Link>
                <Nav.Link href="#">Settings</Nav.Link>
              </Nav>
            </Col>

            {/* Main Content */}
            <Col md={10} className="bg-light p-4">
              <Row>
                {/* Left Content */}
                <Col lg={8}>
                  <div className="bg-white p-3 mb-4 rounded shadow-sm">
                    <p className="mb-1">
                      Your next appointment: <strong>2025-05-10</strong> with
                      Dr. Anjali Thapa
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
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
export default Dashboard;

// <Navbar expand="lg" className="bg-body-tertiary">
//   <Container fluid>
//     <Navbar.Brand href="#">CMS</Navbar.Brand>
//     <Form className="d-flex">
//       <Form.Control
//         type="search"
//         placeholder="Search"
//         className="me-2"
//         aria-label="Search"
//       />
//       <Button variant="outline-success">Search</Button>
//     </Form>
//     <Navbar.Toggle aria-controls="navbarScroll" />
//     <Navbar.Collapse id="navbarScroll">
//       <Nav
//         className="me-auto my-2 my-lg-0"
//         style={{ maxHeight: "100px" }}
//         navbarScroll
//       >
//         <Nav.Link href="#action1">Home</Nav.Link>
//         <Nav.Link href="#action2">Notification</Nav.Link>
//         <Nav.Link href="#action3">Message</Nav.Link>
//         <Nav.Link href="#action4">Book Appointment</Nav.Link>
//         <NavDropdown title="Profile" id="navbarScrollingDropdown">
//           <NavDropdown.Item href="#action5">Edit Profile</NavDropdown.Item>
//           <NavDropdown.Item href="#action7">Logout</NavDropdown.Item>
//         </NavDropdown>
//       </Nav>
//     </Navbar.Collapse>
//   </Container>
// </Navbar>;
