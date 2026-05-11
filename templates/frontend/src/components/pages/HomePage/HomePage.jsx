import { Link } from 'react-router-dom';
import { Button } from '../../atoms';
import './HomePage.css';

export function HomePage() {
  return (
    <section className="home animate-slide-up">
      <div className="home__hero">
        <span className="home__badge">⚡ MERN Stack Boilerplate</span>
        <h1 className="home__title">
          Build Faster with
          <span className="home__highlight"> Modern Stack</span>
        </h1>
        <p className="home__subtitle">
          Full-stack MERN application with Express MVC backend and
          React Atomic Design frontend. Ready to use, easy to extend.
        </p>
        <div className="home__actions">
          <Link to="/items">
            <Button size="lg">🚀 Get Started</Button>
          </Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary">📖 Documentation</Button>
          </a>
        </div>
      </div>

      <div className="home__features">
        <div className="home__feature-card">
          <span className="home__feature-icon">🔧</span>
          <h3>Express MVC</h3>
          <p>Clean MVC architecture with controllers, models, and routes</p>
        </div>
        <div className="home__feature-card">
          <span className="home__feature-icon">⚛️</span>
          <h3>Atomic Design</h3>
          <p>Scalable component structure: atoms, molecules, organisms</p>
        </div>
        <div className="home__feature-card">
          <span className="home__feature-icon">🍃</span>
          <h3>MongoDB</h3>
          <p>Mongoose ODM with schema validation and error handling</p>
        </div>
        <div className="home__feature-card">
          <span className="home__feature-icon">🌐</span>
          <h3>NGINX Ready</h3>
          <p>Pre-configured NGINX reverse proxy for production</p>
        </div>
      </div>
    </section>
  );
}
