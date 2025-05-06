import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { getPendingUsers, verifyUser } from "../../axios/adminAxios";
const AdminPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  // Fetch pending users on component mount
  useEffect(() => {
    const fetchPendingUsers = async () => {
      const result = await getPendingUsers();
      if (result.status === "error") {
        toast.error(result.message || "Failed to fetch pending users");
        return;
      }
      setPendingUsers(result.data || []);
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

  return (
    <Container fluid className="vh-100 bg-light">
      <Row className="py-3 bg-primary text-white">
        <Col>
          <h1 className="text-center">Admin Dashboard</h1>
        </Col>
      </Row>

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
  );
};

export default AdminPage;
