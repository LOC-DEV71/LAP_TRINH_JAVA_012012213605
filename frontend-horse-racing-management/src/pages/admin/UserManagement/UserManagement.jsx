import React, { useState, useEffect } from 'react';
import axiosClient from '../../../services/axiosClient';

const ROLES = ['ADMIN', 'HORSE_OWNER', 'JOCKEY', 'RACE_REFEREE', 'SPECTATOR'];

const emptyForm = {
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'SPECTATOR',
    balance: 0,
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await axiosClient.get('/admin/users');
            setUsers(response);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách user:', error);
            alert('Không thể tải danh sách người dùng.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openCreateModal = () => {
        setCurrentUser(null);
        setFormData(emptyForm);
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setCurrentUser(user);
        setFormData({
            username: user.username || '',
            password: '',
            email: user.email || '',
            fullName: user.fullName || '',
            role: user.role || 'SPECTATOR',
            balance: user.balance ?? 0,
        });
        setModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'balance' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (currentUser) {
                await axiosClient.put(`/admin/users/${currentUser.id}`, {
                    email: formData.email,
                    fullName: formData.fullName,
                    role: formData.role,
                    balance: formData.balance,
                });
                alert('Cập nhật thành công!');
            } else {
                await axiosClient.post('/admin/users', {
                    user: {
                        username: formData.username,
                        email: formData.email,
                        fullName: formData.fullName,
                        role: formData.role,
                        balance: formData.balance,
                    },
                    password: formData.password,
                });
                alert('Tạo user thành công!');
            }
            setModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Lỗi khi lưu user:', error);
            alert('Có lỗi xảy ra khi lưu thông tin user.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
            try {
                await axiosClient.delete(`/admin/users/${id}`);
                alert('Xóa thành công!');
                fetchUsers();
            } catch (error) {
                console.error('Lỗi khi xóa:', error);
                alert('Có lỗi xảy ra khi xóa!');
            }
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Quản lý người dùng (Admin)</h2>

            <button
                onClick={openCreateModal}
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ffd700',
                    color: '#1a1a1a',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    fontWeight: 'bold',
                }}
            >
                + Thêm người dùng
            </button>

            <table
                border="1"
                cellPadding="10"
                style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}
            >
                <thead style={{ backgroundColor: '#003f22', color: '#fff' }}>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Số dư</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.fullName || '-'}</td>
                                <td>{user.email || '-'}</td>
                                <td>{user.role}</td>
                                <td>{user.balance ?? 0}</td>
                                <td>
                                    <button
                                        onClick={() => openEditModal(user)}
                                        style={{ marginRight: '0.5rem' }}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={{ color: '#e60000' }}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '2rem',
                            borderRadius: '8px',
                            minWidth: '400px',
                        }}
                    >
                        <h3>{currentUser ? 'Cập nhật User' : 'Thêm User mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            {!currentUser && (
                                <>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <label>Username</label>
                                        <input
                                            name="username"
                                            value={formData.username}
                                            onChange={handleFormChange}
                                            required
                                            style={{ width: '100%', padding: '0.5rem' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <label>Mật khẩu</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleFormChange}
                                            required
                                            style={{ width: '100%', padding: '0.5rem' }}
                                        />
                                    </div>
                                </>
                            )}
                            {currentUser && (
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <label>Username</label>
                                    <input
                                        value={formData.username}
                                        disabled
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            backgroundColor: '#f2f2f2',
                                        }}
                                    />
                                </div>
                            )}
                            <div style={{ marginBottom: '0.75rem' }}>
                                <label>Họ và tên</label>
                                <input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleFormChange}
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <label>Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleFormChange}
                                    style={{ width: '100%', padding: '0.5rem' }}
                                >
                                    {ROLES.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Số dư</label>
                                <input
                                    type="number"
                                    name="balance"
                                    value={formData.balance}
                                    onChange={handleFormChange}
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#003f22',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    style={{ padding: '0.5rem 1rem' }}
                                >
                                    Đóng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
