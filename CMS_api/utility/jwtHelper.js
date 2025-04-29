import jwt from "jsonwebtoken";

export const generateAccessJWT = async (email) => {
  const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  await createSession({ token, userEmail: email });
  return token;
};
