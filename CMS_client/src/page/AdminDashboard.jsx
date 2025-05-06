import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/api/admin/unverified-users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleVerify = (userId) => {
    axios.put(`/api/admin/verify-user/${userId}`).then(() => {
      setUsers(users.filter((user) => user._id !== userId));
    });
  };

  const handleDelete = (userId) => {
    axios.delete(`/api/admin/delete-user/${userId}`).then(() => {
      setUsers(users.filter((user) => user._id !== userId));
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Registrations</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleVerify(user._id)}
                  className="bg-green-500 text-white px-2 py-1 mr-2"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
