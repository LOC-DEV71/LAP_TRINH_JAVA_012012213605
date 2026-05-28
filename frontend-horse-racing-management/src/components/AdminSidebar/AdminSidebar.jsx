import { NavLink } from 'react-router-dom';
import { MdDashboard, MdSettings, MdHelpOutline } from 'react-icons/md';
import { FaUsers, FaTrophy, FaPlus } from 'react-icons/fa';
import { GiHorseHead } from 'react-icons/gi';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <h2>EquineElite</h2>
        <span className="logo-sub">Management Portal</span>
      </div>
      
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
              <MdDashboard size={20} className="menu-icon" /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FaUsers size={20} className="menu-icon" /> Quản lý User
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/tournaments" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FaTrophy size={20} className="menu-icon" /> Quản lý Giải Đấu
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/horses" className={({ isActive }) => (isActive ? 'active' : '')}>
              <GiHorseHead size={20} className="menu-icon" /> Quản lý Ngựa
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <button className="btn-create-tournament">
          <FaPlus size={14} /> Tạo Giải Đấu
        </button>
        <ul className="sidebar-bottom-menu">
          <li>
            <a href="#settings"><MdSettings size={20} className="menu-icon" /> Settings</a>
          </li>
          <li>
            <a href="#support"><MdHelpOutline size={20} className="menu-icon" /> Support</a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default AdminSidebar;
