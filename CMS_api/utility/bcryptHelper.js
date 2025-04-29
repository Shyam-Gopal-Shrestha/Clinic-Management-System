import bcrypt from "bcryptjs";

const salt = 15;

export const hashPassword = (plainPassword) => {
  const hashPassword = bcrypt.hashSync(plainPassword, salt);

  return hashPassword;
};

export const comparePassword = async (enteredPassword, storedPasswordHash) => {
  try {
    return await bcrypt.compare(enteredPassword, storedPasswordHash);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Error comparing passwords");
  }
};
