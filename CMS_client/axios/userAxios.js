import axios from "axios";

const USER_API_URL = "http://localhost:8000/api/users";

// public Routes | Public Endpoints
// create user | signup
export const createUser = (userObj) => {
  const response = axios
    .post(`${USER_API_URL}/signup`, userObj)
    .then((res) => res.data)
    .catch((error) => {
      console.log(error);
    });
  return response;
};

// login user
export const loginUser = (userObj) => {
  const response = axios
    .post(`${USER_API_URL}/login`, userObj)
    .then((res) => res.data)
    .catch((error) => {
      console.log(error);
    });
  return response;
};
