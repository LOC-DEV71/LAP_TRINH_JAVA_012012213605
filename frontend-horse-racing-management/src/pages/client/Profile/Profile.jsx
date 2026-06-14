import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiUser, FiLock, FiShield, FiBriefcase, FiTarget, FiActivity, FiStar } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
    const { user, isAuthenticated, isInitializing } = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isInitializing && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, isInitializing, navigate]);

    const getRoleName = (role) => {
        if (!role) return 'N/A';
        return role.replace('ROLE_', '').replace('_', ' ');
    };

    if (!user) return <div className="profile-container"><div className="profile-loading">Đang tải...</div></div>;

    const renderRoleLinks = () => {
        switch (user.role) {
            case 'ROLE_HORSE_OWNER':
                return (
                    <>
                        <h4 className="sidebar-heading">Khu vực Chủ Ngựa</h4>
                        <NavLink to="owner-dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <FiBriefcase className="sidebar-icon" /> Quản lý chung
                        </NavLink>
                    </>
                );
            case 'ROLE_JOCKEY':
                return (
                    <>
                        <h4 className="sidebar-heading">Khu vực Nài Ngựa</h4>
                        <NavLink to="jockey-dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <FiTarget className="sidebar-icon" /> Lời mời & Lịch đấu
                        </NavLink>
                    </>
                );
            case 'ROLE_RACE_REFEREE':
                return (
                    <>
                        <h4 className="sidebar-heading">Khu vực Trọng Tài</h4>
                        <NavLink to="referee-dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <FiActivity className="sidebar-icon" /> Nhiệm vụ & Biên bản
                        </NavLink>
                    </>
                );
            case 'ROLE_SPECTATOR':
                return (
                    <>
                        <h4 className="sidebar-heading">Khu vực Khán Giả</h4>
                        <NavLink to="spectator-dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <FiStar className="sidebar-icon" /> Dự đoán & Thưởng
                        </NavLink>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header-banner">
                <div className="profile-header-content">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : <FiUser />}
                        </div>
                    </div>
                    <div className="profile-header-info">
                        <h1 className="profile-name">{user.fullName || user.username}</h1>
                        <p className="profile-username">@{user.username}</p>
                        <div className="profile-tags">
                            <span className="profile-tag role-tag">
                                <FiShield size={14} /> {getRoleName(user.role)}
                            </span>
                            {user.balance !== undefined && (
                                <span className="profile-tag balance-tag">
                                    Số dư: {user.balance.toLocaleString()} VND
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-layout-wrapper">
                {/* Sidebar Navigation */}
                <aside className="profile-sidebar">
                    <div className="sidebar-section">
                        <h4 className="sidebar-heading">Tài khoản</h4>
                        <NavLink to="." end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <FiUser className="sidebar-icon" /> Thông tin cơ bản
                        </NavLink>
                        <NavLink to="security" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <FiLock className="sidebar-icon" /> Bảo mật
                        </NavLink>
                    </div>

                    <div className="sidebar-section">
                        {renderRoleLinks()}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="profile-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Profile;
