import * as authService from '../services/authService.js';

const sendTokenResponse = async (user, statusCode, res) => {
  try {
    const token = await authService.manageUserSession(user);

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    await sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await authService.loginUser(req.body.email, req.body.password);
    await sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    await authService.logoutUser(req.cookies.token);

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully, session cleared from database.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await authService.updateUserProfile(req.user.id, req.body, req.file);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers(req.user);
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};
