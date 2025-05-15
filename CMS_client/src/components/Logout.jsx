import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../axios/userAxios";
import { FaSignOutAlt } from "react-icons/fa";
import { NavDropdown } from "react-bootstrap";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.success) {
        // Clear any app state if needed
        navigate("/");
      } else {
        console.error("Logout failed:", response.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      navigate("/");
    }
  };

  return (
    <NavDropdown.Item onClick={handleLogout}>
      <FaSignOutAlt className="me-2" />
      Logout
    </NavDropdown.Item>
  );
};

export default Logout;
