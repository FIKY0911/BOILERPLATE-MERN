import 'dotenv/config';
import app from './app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🔐 Auth API:     http://localhost:${PORT}/api/auth`);
    console.log(`📦 Workspace API: http://localhost:${PORT}/api/workspaces\n`);
  });
});
