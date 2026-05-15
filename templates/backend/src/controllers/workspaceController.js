import Workspace from '../models/Workspace.js';

/**
 * @desc    Get all workspaces for current user
 * @route   GET /api/workspaces
 * @access  Private
 */
export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [{ owner: req.user.id }, { 'members.user': req.user.id }],
    });

    res.status(200).json({ success: true, data: workspaces });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Create new workspace
 * @route   POST /api/workspaces
 * @access  Private
 */
export const createWorkspace = async (req, res) => {
  try {
    req.body.owner = req.user.id;

    const workspace = await Workspace.create(req.body);

    res.status(201).json({ success: true, data: workspace });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
