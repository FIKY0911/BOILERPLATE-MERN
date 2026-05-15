import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './components/pages/index.js';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      {/* Fallback for other routes in this demo */}
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
