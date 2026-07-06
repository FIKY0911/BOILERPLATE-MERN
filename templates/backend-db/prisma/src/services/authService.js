import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const getSignedJwtToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  return user;
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    const error = new Error('Please provide an email and password');
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  return user;
};

export const logoutUser = async (token) => {
  if (token) {
    const users = await prisma.user.findMany();
    for (const user of users) {
      const tokens = user.refreshTokens || [];
      const filtered = tokens.filter(t => t.token !== token);
      if (filtered.length !== tokens.length) {
        await prisma.user.update({
          where: { id: user.id },
          data: { refreshTokens: filtered },
        });
        break;
      }
    }
  }
};

export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const updateUserProfile = async (userId, updateData, file) => {
  const { name, email, password } = updateData;

  const data = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (password) data.password = await bcrypt.hash(password, 10);
  if (file) data.avatar = `/uploads/${file.filename}`;

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return user;
};

export const getAllUsers = async (requestingUser) => {
  if (requestingUser.role !== 'admin') {
    const error = new Error('Not authorized to access this route');
    error.statusCode = 403;
    throw error;
  }
  const users = await prisma.user.findMany();
  return users;
};

export const manageUserSession = async (user) => {
  const token = getSignedJwtToken(user);
  const tokens = user.refreshTokens || [];
  tokens.push({ token });

  if (tokens.length > 5) {
    tokens.shift();
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokens: tokens },
  });

  return token;
};
