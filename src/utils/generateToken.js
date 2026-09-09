import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, school: user.school, }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY, });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, school: user.school }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};