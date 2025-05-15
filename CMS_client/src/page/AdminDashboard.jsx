import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Nav,
  Navbar,
  Dropdown,
  Alert,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { getPendingUsers, verifyUser } from "../../axios/adminAxios";
import { logoutUser } from "../../axios/userAxios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]); // Initialize as empty array
  const [error, setError] = useState("");

  // Fetch pending users on component mount
  useEffect(() => {
    const fetchPendingUsers = async () => {
      const result = await getPendingUsers();
      if (result.status === "error") {
        toast.error(result.message || "Failed to fetch pending users");
        return;
      }
      // Ensure we're setting an array
      setPendingUsers(Array.isArray(result.data) ? result.data : []);
    };

    fetchPendingUsers();
  }, []);

  // Handle user verification
  const handleVerify = async (userId, isApproved) => {
    const result = await verifyUser(userId, isApproved);
    if (result.status === "error") {
      toast.error(result.message || "Failed to verify user");
      return;
    }

    toast.success(result.message);
    // Remove the verified/rejected user from the list
    setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
  };

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

      {/* Header */}
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand>Admin Dashboard</Navbar.Brand>
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
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container fluid className="flex-grow-1 bg-light">
        <Row className="mt-4">
          <Col md={12} className="p-3 bg-white shadow-sm rounded">
            <h4>Pending Signups</h4>
            {pendingUsers.length === 0 ? (
              <p>No pending signups to verify.</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleVerify(user._id, true)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleVerify(user._id, false)}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
