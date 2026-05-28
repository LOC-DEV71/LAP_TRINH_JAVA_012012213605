import { NavLink, Link } from 'react-router-dom';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import './ClientNavbar.css';

const ClientNavbar = () => {
  return (
    <nav className="client-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EQUINEELITE
        </Link>
        
        <ul className="navbar-menu">
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Trang Chủ</NavLink>
          </li>
          <li>
            <NavLink to="/tournaments" className={({ isActive }) => (isActive ? 'active' : '')}>Giải Đấu</NavLink>
          </li>
          <li>
            <NavLink to="/races" className={({ isActive }) => (isActive ? 'active' : '')}>Lịch Đua</NavLink>
          </li>
          <li>
            <NavLink to="/betting" className={({ isActive }) => (isActive ? 'active' : '')}>Dự Đoán</NavLink>
          </li>
        </ul>

        <div className="navbar-actions">
          <div className="search-bar-client">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search bloodlines..." />
          </div>
          <button className="icon-btn-client">
            <FiBell size={20} />
          </button>
          <button className="icon-btn-client">
            <FiUser size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
