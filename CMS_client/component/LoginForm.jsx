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

    if (result.status === "error") {
      return toast.error(result.message);
    }
    console.log("Login Response:", result.data);
    toast.success(result.message);

    // Store user details in local storage
    const { role, name, id } = result.data; // Assuming the API returns "role" and "name"
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name); // Store the user's name
    localStorage.setItem("doctorId", id); // Store the doctor's ID

    // Redirect based on role
    if (role === "Doctor") {
      navigate("/doctor-dashboard");
    } else if (role === "Patient") {
      navigate("/patient-dashboard");
    } else if (role === "Receptionist") {
      navigate("/receptionist-dashboard");
    } else if (role === "Admin") {
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
