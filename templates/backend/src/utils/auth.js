import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} - JWT Token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * Hash Password
 * @param {string} password - Raw password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare Password
 * @param {string} enteredPassword - Password from user
 * @param {string} hashedPassword - Hashed password from DB
 * @returns {Promise<boolean>} - Match result
 */
export const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};
