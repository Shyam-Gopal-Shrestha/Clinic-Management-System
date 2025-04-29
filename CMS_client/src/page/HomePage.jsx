import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AuthPage from "../../component/AuthPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/logo.png"; // Adjust the path as necessary

export default function HomePage() {
  return (
    <Container fluid className="vh-100 p-0">
      <Row className="h-100 g-0">
        {/* Left Side */}
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column align-items-center justify-content-center bg-light p-4"
        >
          <img
            src={logo}
            alt="Clinic Logo"
            style={{ width: "250px", height: "auto", marginBottom: "20px" }}
          />
          <h1 className="text-center">Clinic Management System</h1>
          <p
            className="text-center text-muted mt-3"
            style={{ maxWidth: "400px" }}
          >
            Streamlining your clinic operations with efficient patient,
            appointment, and staff management.
          </p>
        </Col>

        {/* Right Side */}
        <Col
          xs={12}
          md={6}
          className="d-flex align-items-center justify-content-center p-4"
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <AuthPage />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

//  <Container fluid className="vh-100">
//     <Row className="h-100">
//       <Col
//         xs={12}
//         md={6}
//         className="d-flex align-items-center justify-content-center bg-light"
//       >
//         <div>
//           <h1>
//             Clinic Management System
//             <br />
//             <img
//               src={logo}
//               alt="Clinic Logo"
//               style={{ width: "250px", height: "275px" }}
//             />
//           </h1>
//         </div>
//       </Col>

//       <Col
//         xs={12}
//         md={6}
//         className="d-flex align-items-center justify-content-center"
//       >
//         <AuthPage />
//       </Col>
//     </Row>
//   </Container>
