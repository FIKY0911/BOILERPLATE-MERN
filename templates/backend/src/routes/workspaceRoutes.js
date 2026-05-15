import express from 'express';
import { getWorkspaces, createWorkspace } from '../controllers/workspaceController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getWorkspaces)
  .post(protect, createWorkspace);

export default router;
