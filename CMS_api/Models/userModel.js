import userSchema from "../schema/userSchema.js";

// SignUp route || Register route
export const createUser = (userObj) => {
  return userSchema(userObj).save();
};
// export const createUser = async (userData) => {
//   const user = new User(userData);
//   return await user.save();
// };

// find user by email
export const findUserByEmail = (email) => {
  return userSchema.findOne({ email });
};
