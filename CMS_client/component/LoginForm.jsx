import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomInput from "./CustomInput";
import { loginUser } from "../axios/userAxios.js";
import useForm from "../hooks/useForm.js";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const initialFormData = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const { formData, handleOnChange } = useForm(initialFormData);
  const { email, password } = formData;

  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    // axios call
    const result = await loginUser({
      email,
      password,
    });

    console.log("API Response:", result); // Debugging: Check the API response

    if (result.status === "error") {
      return toast.error(result.message);
    }

    toast.success(result.message);

    // Store role in local storage
    const { role } = result.data; // Assuming the API returns a "role" field
    console.log("User role:", role); // Debugging: Check the role
    localStorage.setItem("userRole", role);

    // Redirect based on role
    if (role === "Doctor") {
      console.log("Navigating to /doctor-dashboard");
      navigate("/doctor-dashboard");
    } else if (role === "Patient") {
      console.log("Navigating to /patient-dashboard");
      navigate("/patient-dashboard");
    } else if (role === "Receptionist") {
      console.log("Navigating to /receptionist-dashboard");
      navigate("/receptionist-dashboard");
    } else if (role === "Admin") {
      console.log("Navigating to /admin-dashboard");
      navigate("/admin-dashboard");
    } else {
      toast.error("Invalid role. Please contact support.");
    }
  };

  return (
    <Form onSubmit={handleOnSubmit} className="p-4 shadow rounded bg-white">
      <CustomInput
        label="Email Address"
        handleOnChange={handleOnChange}
        inputAttributes={{
          type: "email",
          name: "email",
          value: formData.email,
          required: true,
        }}
      />

      <CustomInput
        label="Password"
        handleOnChange={handleOnChange}
        inputAttributes={{
          type: "password",
          name: "password",
          value: formData.password,
          required: true,
        }}
      />

      <Button variant="primary" type="submit" className="w-100">
        Login
      </Button>
      <ToastContainer />
    </Form>
  );
};

export default LoginForm;
