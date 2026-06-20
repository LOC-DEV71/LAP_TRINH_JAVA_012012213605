import React, { useState, useEffect } from 'react';
import { FiPlus, FiList } from 'react-icons/fi';
import axiosClient from '../../../../services/axiosClient';

const HorseOwnerDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [myHorses, setMyHorses] = useState([
        { id: 1, name: 'Tia Chớp', age: 3, wins: 5, status: 'Sẵn sàng' },
        { id: 2, name: 'Bão Táp', age: 4, wins: 2, status: 'Đang nghỉ ngơi' },
    ]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newHorse, setNewHorse] = useState({ name: '', age: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const jockeyRequests = [
        { id: 1, jockeyName: 'Nguyễn Văn A', horseName: 'Tia Chớp', race: 'Giải Mùa Hè 2026', status: 'Chờ phản hồi' },
    ];

    // Fetch dữ liệu từ API
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // SỬA: Thay apiClient bằng axiosClient và bỏ .data vì interceptor đã xử lý
            const userRes = await axiosClient.get('/auth/me');
            setUserInfo(userRes);
            
            // SỬA: Truyền trực tiếp userRes.id
            const horsesRes = await axiosClient.get(`/horses/owner/${userRes.id}`);
            setMyHorses(horsesRes);
            
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            // Giữ mock data nếu lỗi
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Xử lý thêm ngựa mới
    const handleAddHorse = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            
            // SỬA: Thay apiClient bằng axiosClient
            await axiosClient.post('/horses', {
                ...newHorse,
                age: parseInt(newHorse.age),
                ownerId: userInfo?.id
            });
            
            setIsModalOpen(false);
            setNewHorse({ name: '', age: '' });
            await fetchDashboardData();
        } catch (err) {
            console.error("Lỗi khi thêm ngựa:", err);
            alert("Có lỗi xảy ra khi thêm ngựa mới.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="dashboard-wrapper fade-in">
            <h2 className="dashboard-title">Bảng điều khiển Chủ Ngựa</h2>
            
            <div className="dashboard-section">
                <div className="section-header">
                    <h3>Ngựa của tôi</h3>
                    {/* SỬA: Thêm sự kiện onClick để mở Modal */}
                    <button 
                        className="btn-primary btn-sm" 
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FiPlus /> Thêm ngựa mới
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="tm-table">
                        <thead>
                            <tr>
                                <th>Tên ngựa</th>
                                <th>Tuổi</th>
                                <th>Số trận thắng</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myHorses.map(horse => (
                                <tr key={horse.id}>
                                    <td><strong>{horse.name}</strong></td>
                                    <td>{horse.age}</td>
                                    <td>{horse.wins}</td>
                                    <td>
                                        <span className={`status-badge ${horse.status === 'Sẵn sàng' ? 'success' : 'warning'}`}>
                                            {horse.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-secondary btn-sm">Chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="dashboard-section" style={{marginTop: '30px'}}>
                <div className="section-header">
                    <h3>Quản lý Jockey (Nài ngựa)</h3>
                    <button className="btn-outline btn-sm"><FiList /> Xem tất cả</button>
                </div>
                <div className="table-responsive">
                    <table className="tm-table">
                        <thead>
                            <tr>
                                <th>Jockey</th>
                                <th>Ngựa</th>
                                <th>Giải đấu</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jockeyRequests.map(req => (
                                <tr key={req.id}>
                                    <td>{req.jockeyName}</td>
                                    <td>{req.horseName}</td>
                                    <td>{req.race}</td>
                                    <td>
                                        <span className="status-badge pending">{req.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

           {/* MODAL THÊM NGỰA MỚI */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: '#fff', padding: '24px', borderRadius: '8px',
                        width: '100%', maxWidth: '400px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', marginTop: 0, marginBottom: '20px' }}>
                            Thêm ngựa mới
                        </h3>
                        <form onSubmit={handleAddHorse}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                                    Tên ngựa
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    style={{
                                        width: '100%', padding: '10px 12px', border: '1px solid #cbd5e0', 
                                        borderRadius: '6px', outline: 'none', boxSizing: 'border-box'
                                    }}
                                    value={newHorse.name}
                                    onChange={(e) => setNewHorse({...newHorse, name: e.target.value})}
                                    placeholder="Ví dụ: Tía Chớp"
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                                    Tuổi
                                </label>
                                <input 
                                    type="number" 
                                    required
                                    min="1"
                                    style={{
                                        width: '100%', padding: '10px 12px', border: '1px solid #cbd5e0', 
                                        borderRadius: '6px', outline: 'none', boxSizing: 'border-box'
                                    }}
                                    value={newHorse.age}
                                    onChange={(e) => setNewHorse({...newHorse, age: e.target.value})}
                                    placeholder="Ví dụ: 3"
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    style={{
                                        padding: '8px 16px', border: '1px solid #cbd5e0', backgroundColor: '#f7fafc',
                                        color: '#4a5568', borderRadius: '6px', cursor: 'pointer', fontWeight: '500'
                                    }}
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    style={{
                                        padding: '8px 16px', border: 'none', backgroundColor: '#3182ce',
                                        color: 'white', borderRadius: '6px', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        opacity: isSubmitting ? 0.7 : 1, fontWeight: '500'
                                    }}
                                >
                                    {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HorseOwnerDashboard;