import { NavLink } from 'react-router-dom';
import '../../styles/navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand" aria-label="EventHub home">
        <i className="fa-solid fa-calendar-days" aria-hidden="true"></i> EventHub
      </NavLink>
      <nav aria-label="Main navigation">
        <ul className="navbar__links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}
              end
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              Discover
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add"
              className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}
            >
              Add Event
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/discover-tonight"
              className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}
            >
              Tonight
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/preferences"
              className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}
            >
              Preferences
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}