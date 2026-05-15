import mongoose from 'mongoose';

const WorkspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a workspace name'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member',
      },
    },
  ],
  settings: {
    theme: {
      type: String,
      default: 'dark',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create slug from name
WorkspaceSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().split(' ').join('-');
  next();
});

export default mongoose.model('Workspace', WorkspaceSchema);
