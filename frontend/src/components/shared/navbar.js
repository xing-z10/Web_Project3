import { NavLink } from 'react-router-dom';
import '../../styles/navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__brand">EventHub</NavLink>
      <div className="navbar__links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'navbar__link active' : 'navbar__link'} end>
          Discover
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => isActive ? 'navbar__link active' : 'navbar__link'}>
          Add Event
        </NavLink>
        <NavLink to="/preferences" className={({ isActive }) => isActive ? 'navbar__link active' : 'navbar__link'}>
          Preferences
        </NavLink>
      </div>
    </nav>
  );
}
