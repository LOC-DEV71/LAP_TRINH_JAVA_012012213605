import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../../../redux/slices/authSlice';
import axiosClient from '../../../services/axiosClient';
import { showToast, showErrorAlert } from '../../../utils/alertUtils';
import { FiUser, FiMail, FiLock, FiShield, FiSave, FiEdit3, FiX } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
    const { user, isAuthenticated, isInitializing } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: ''
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

    useEffect(() => {
        if (!isInitializing && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, isInitializing, navigate]);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosClient.put('/auth/me', {
                fullName: formData.fullName,
                email: formData.email
            });

            showToast('Cập nhật hồ sơ thành công!', 'success');
            dispatch(fetchCurrentUser());
        } catch (error) {
            console.error('Lỗi cập nhật hồ sơ:', error);
            showErrorAlert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showErrorAlert('Lỗi', 'Mật khẩu xác nhận không khớp!');
            return;
        }

        setLoading(true);
        try {
            await axiosClient.put('/auth/me/password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            showToast('Đổi mật khẩu thành công!', 'success');
            setPasswordModalOpen(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            showErrorAlert('Lỗi', error.response?.data?.message || 'Không thể đổi mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    const getRoleName = (role) => {
        if (!role) return 'N/A';
        return role.replace('ROLE_', '').replace('_', ' ');
    };

    if (!user) return <div className="profile-container"><div className="profile-loading">Đang tải...</div></div>;

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
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-content-wrapper">
                <div className="profile-card main-info-card">
                    <div className="card-header">
                        <h3 className="card-title">Thông Tin Cơ Bản</h3>
                        <p className="card-subtitle">Cập nhật thông tin cá nhân của bạn tại đây</p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="profile-form">
                        <div className="form-group">
                            <label>Họ và Tên</label>
                            <div className="input-group">
                                <span className="input-icon"><FiUser /></span>
                                <input 
                                    type="text" 
                                    name="fullName" 
                                    value={formData.fullName} 
                                    onChange={handleFormChange} 
                                    required
                                    className="premium-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email liên hệ</label>
                            <div className="input-group disabled-group">
                                <span className="input-icon"><FiMail /></span>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    disabled
                                    className="premium-input disabled"
                                />
                                <span className="disabled-hint">Không thể thay đổi email</span>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Đang lưu...' : <><FiSave /> Lưu thay đổi</>}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="profile-side-column">
                    <div className="profile-card side-card">
                        <h4 className="side-card-title">Tài Chính</h4>
                        <div className="balance-display">
                            <span className="balance-label">Số dư khả dụng</span>
                            <span className="balance-amount">{user.balance?.toLocaleString() || '0'} <small>$</small></span>
                        </div>
                        <button className="btn-outline w-100">Nạp thêm tiền</button>
                    </div>

                    <div className="profile-card side-card">
                        <h4 className="side-card-title">Bảo Mật</h4>
                        <p className="side-card-desc">Bảo vệ tài khoản của bạn bằng cách sử dụng mật khẩu mạnh.</p>
                        <button 
                            className="btn-secondary w-100"
                            onClick={() => setPasswordModalOpen(true)}
                        >
                            <FiLock /> Đổi mật khẩu
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {isPasswordModalOpen && (
                <div className="modal-overlay" onClick={() => setPasswordModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Đổi mật khẩu</h3>
                            <button className="btn-close" onClick={() => setPasswordModalOpen(false)}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="modal-body">
                            <div className="form-group">
                                <label>Mật khẩu hiện tại</label>
                                <input 
                                    type="password" 
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="premium-input"
                                    placeholder="Nhập mật khẩu hiện tại..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="premium-input"
                                    placeholder="Nhập mật khẩu mới..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Xác nhận mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="premium-input"
                                    placeholder="Nhập lại mật khẩu mới..."
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-ghost" onClick={() => setPasswordModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Đang lưu...' : 'Xác nhận đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
