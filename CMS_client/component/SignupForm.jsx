import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CustomInput from "./CustomInput";
import { createUser } from "../axios/userAxios.js";
import { toast, ToastContainer } from "react-toastify";
import useForm from "../hooks/useForm.js";
import "react-toastify/dist/ReactToastify.css";

const initialFormData = {
  name: "",
  contactNumber: "",
  address: "",
  email: "",
  password: "",
  role: "doctor", // default role selection
};

const SignupForm = (props) => {
  const { setIsLoginMode } = props;
  const useFormPayLoad = useForm(initialFormData);
  const { formData, handleOnChange } = useFormPayLoad;
  const { name, contactNumber, address, email, password, role } = formData;

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const result = await createUser({
      name,
      contactNumber,
      address,
      email,
      password,
      role,
    });

    if (result.status === "error") {
      toast.error(result.message || "Error occurred while creating user");
      return;
    }

    toast.success(result.message);
    setIsLoginMode(true);
  };

  return (
    <>
      <Form onSubmit={handleOnSubmit} className="p-4 shadow rounded bg-white">
        <CustomInput
          label="Name"
          inputAttributes={{
            type: "text",
            name: "name",
            value: name,
            required: true,
          }}
          handleOnChange={handleOnChange}
        />

        <CustomInput
          label="Contact Number"
          inputAttributes={{
            type: "number",
            name: "contactNumber",
            value: contactNumber,
            required: true,
          }}
          handleOnChange={handleOnChange}
        />

        <CustomInput
          label="Address"
          inputAttributes={{
            type: "text",
            name: "address",
            value: address,
            required: true,
          }}
          handleOnChange={handleOnChange}
        />

        <CustomInput
          label="Email Address"
          inputAttributes={{
            type: "email",
            name: "email",
            value: email,
            required: true,
          }}
          handleOnChange={handleOnChange}
        />

        <CustomInput
          label="Password"
          inputAttributes={{
            type: "password",
            name: "password",
            value: password,
            required: true,
          }}
          handleOnChange={handleOnChange}
        />

        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select
            name="role"
            value={role}
            onChange={handleOnChange}
            required
          >
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
          </Form.Select>
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">
          Sign up
        </Button>
      </Form>

      <ToastContainer />
    </>
  );
};

export default SignupForm;
