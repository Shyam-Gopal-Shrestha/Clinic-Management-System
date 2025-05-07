import User from "../schema/userSchema.js";

// Create new user
export const createUser = (userObj) => {
  return new User(userObj).save();
};

// Find user by email
export const findUserByEmail = (email) => {
  return User.findOne({ email });
};

// Find all doctors
export const findDoctors = async () => {
  try {
    const doctors = await User.find({ role: "Doctor" })
      .select("name _id")
      .sort({ name: 1 })
      .lean(); // Convert to plain JavaScript objects

    return doctors;
  } catch (error) {
    console.error("Error in findDoctors:", error);
    return [];
  }
};

export default User;
