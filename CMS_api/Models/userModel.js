// filepath: /path/to/userModel.js
import User from "../schema/userSchema.js"; // Adjust the path if necessary

// SignUp route || Register route
export const createUser = (userObj) => {
  return new User(userObj).save();
};

// Find user by email
export const findUserByEmail = (email) => {
  return User.findOne({ email });
};
