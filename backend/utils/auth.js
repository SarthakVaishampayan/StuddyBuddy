import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const saltRounds = 12;

// Encrypt password using bcrypt - ADDED EXPORT
export const hashPassword = async (password) => {
  try {
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Password encryption failed");
  }
};

// Verify password - ADDED EXPORT
export const verifyPassword = async (password, hashedPassword) => {
  try {
    return await bcryptjs.compare(password, hashedPassword);
  } catch (error) {
    console.error("Password verification error:", error);
    throw new Error("Password verification failed");
  }
};

// Generate JWT token - ADDED EXPORT
export const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
