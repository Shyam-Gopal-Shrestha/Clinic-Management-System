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

    // Enhanced validation
    if (!email?.trim() || !password?.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Add more detailed logging
      console.log("Attempting login with:", {
        email,
        passwordProvided: !!password,
      });

      const result = await loginUser({
        email,
        password,
      });

      // Log complete response
      console.log("Complete login response:", result);

      // First check for error status
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      // Validate user data
      if (!result.data?.role) {
        console.error("Invalid response structure:", result);
        toast.error("Invalid response from server");
        return;
      }

      // Store user data
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...result.data,
          email,
        })
      );

      toast.success("Login successful!");

      // Navigate based on role
      switch (result.data.role) {
        case "Doctor":
          navigate("/doctor-dashboard");
          break;
        case "Patient":
          navigate("/patient-dashboard");
          break;
        case "Receptionist":
          navigate("/receptionist-dashboard");
          break;
        case "Admin":
          navigate("/admin-dashboard");
          break;
        default:
          toast.error("Invalid role assigned");
          console.error("Unknown role:", result.data.role);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
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
