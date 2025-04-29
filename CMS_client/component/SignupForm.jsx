import React, { useState } from "react";
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
};

const SignupForm = (props) => {
  const { setIsLoginMode } = props;
  const useFormPayLoad = useForm(initialFormData);
  const { formData, handleOnChange } = useFormPayLoad;
  const { name, contactNumber, address, email, password } = formData;

  // handle form submission
  const handleOnSubmit = async (e) => {
    // prevent default action of browser on events
    e.preventDefault();

    // axios call
    const result = await createUser({
      name,
      contactNumber,
      address,
      email,
      password,
    });
    console.log("formdata: ", result);

    if (result.status === "error") {
      toast.error(result.message || "Error occurred while creating user");
      console.log(result);
      return;
    }
    toast.success(result.message);
    console.log(result);
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
            value: formData.name,
            required: true,
          }}
          handleOnChange={handleOnChange}
        />

        <CustomInput
          label="Contact Number"
          inputAttributes={{
            type: "number",
            name: "contactNumber",
            value: formData.contactNumber,
            required: true,
          }}
          handleOnChange={handleOnChange}
        />

        <CustomInput
          label="Address"
          inputAttributes={{
            type: "text",
            name: "address",
            value: formData.address,
            required: true,
          }}
          handleOnChange={handleOnChange}
        />

        <CustomInput
          label="Email Address"
          inputAttributes={{
            type: "email",
            name: "email",
            value: formData.email,
            required: true,
          }}
          handleOnChange={handleOnChange}
        />

        <CustomInput
          label="Password"
          inputAttributes={{
            type: "password",
            name: "password",
            value: formData.password,
            required: true,
          }}
          handleOnChange={handleOnChange}
        />
        <Button variant="success" type="submit" className="w-100">
          Sign up
        </Button>
      </Form>

      <ToastContainer />
    </>
  );
};

export default SignupForm;
