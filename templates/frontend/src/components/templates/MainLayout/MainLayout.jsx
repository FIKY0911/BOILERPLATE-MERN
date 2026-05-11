import { Outlet } from 'react-router-dom';
import { Navbar } from '../../organisms';
import './MainLayout.css';

export function MainLayout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main container">
        <Outlet />
      </main>
      <footer className="layout__footer">
        <p>© 2025 MERN Boilerplate — Built with ❤️</p>
      </footer>
    </div>
  );
}
