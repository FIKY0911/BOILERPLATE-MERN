import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">⚡</span>
          <span className="navbar__name">{{PROJECT_NAME}}</span>
        </Link>

        <ul className="navbar__links">
          <li>
            <Link
              to="/"
              className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/items"
              className={`navbar__link ${isActive('/items') ? 'navbar__link--active' : ''}`}
            >
              Items
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
