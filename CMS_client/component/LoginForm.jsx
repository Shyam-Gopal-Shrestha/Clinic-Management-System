import { Button, Form } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import CustomInput from "./CustomInput";
import { loginUser } from "../axios/userAxios.js";
import useForm from "../hooks/useForm.js";
import { toast } from "react-toastify";

const initialFormData = {
  email: "",
  password: "",
};
// handle form input change
const LoginForm = () => {
  const { formData, handleOnChange } = useForm(initialFormData);

  const { email, password } = formData;
  console.log(formData);

  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    // axios call
    const result = await loginUser({
      email,
      password,
    });

    console.log("formdata: ", result);

    if (result.status === "error") {
      console.log("Error:", result.message);
      return toast.error(result.message);
    }

    toast.success(result.message);
    if (result.status === "success") {
      console.log("Login Successful:", result.message);
      navigate("/dashboard");
    }
  };

  return (
    <Form onSubmit={handleOnSubmit}>
      <h3 className="text-center mb-4">Login</h3>

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
    </Form>
  );
};

export default LoginForm;
