import User from '../models/User.js';

export const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const user = await User.create({ name, email, password });
  return user;
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    const error = new Error('Please provide an email and password');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  return user;
};

export const logoutUser = async (token) => {
  if (token) {
    await User.findOneAndUpdate(
      { 'refreshTokens.token': token },
      { $pull: { refreshTokens: { token: token } } }
    );
  }
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const updateUserProfile = async (userId, updateData, file) => {
  const { name, email, password } = updateData;
  const user = await User.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  if (file) {
    user.avatar = `/uploads/${file.filename}`;
  }

  await user.save();
  return user;
};

export const getAllUsers = async (requestingUser) => {
  if (requestingUser.role !== 'admin') {
    const error = new Error('Not authorized to access this route');
    error.statusCode = 403;
    throw error;
  }
  const users = await User.find().select('-password');
  return users;
};

export const manageUserSession = async (user) => {
  const token = user.getSignedJwtToken();
  user.refreshTokens.push({ token });
  
  if (user.refreshTokens.length > 5) {
    user.refreshTokens.shift();
  }
  await user.save();
  
  return token;
};
