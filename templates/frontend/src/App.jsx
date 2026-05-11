import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/templates';
import { HomePage, ItemsPage, ItemDetailPage } from './components/pages';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
