import React, { useState, useEffect } from 'react';
import { FiPlus, FiList } from 'react-icons/fi';
import apiClient from '../../../../utils/axiosConfig';

const HorseOwnerDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [myHorses, setMyHorses] = useState([]);
    const [jockeyRequests, setJockeyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newHorse, setNewHorse] = useState({ name: '', age: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch dữ liệu từ API
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const userRes = await apiClient.get('/auth/me');
            setUserInfo(userRes.data);
            
            // Fetch ngựa của chủ hiện tại
            const horsesRes = await apiClient.get(`/horses/owner/${userRes.data.id}`);
            setMyHorses(horsesRes.data);

            // Mock jockey requests (chưa có API)
            setJockeyRequests([
                { id: 1, jockeyName: 'Nguyễn Văn A', horseName: 'Tia Chớp', race: 'Giải Mùa Hè 2026', status: 'Chờ phản hồi' },
            ]);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setError("Không thể tải dữ liệu. Vui lòng thử lại.");
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
            await apiClient.post('/horses', {
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

    if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
    if (error) return <div className="text-center py-10" style={{color: 'red'}}>{error}</div>;

    return (
        <div className="dashboard-wrapper fade-in">
            <h2 className="dashboard-title">Bảng điều khiển Chủ Ngựa</h2>
            
            <div className="dashboard-section">
                <div className="section-header">
                    <h3>Ngựa của tôi</h3>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary btn-sm"
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
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myHorses.length > 0 ? (
                                myHorses.map(horse => (
                                    <tr key={horse.id}>
                                        <td><strong>{horse.name}</strong></td>
                                        <td>{horse.age}</td>
                                        <td>
                                            <span className="status-badge success">Khỏe mạnh</span>
                                        </td>
                                        <td>
                                            <button className="btn-secondary btn-sm">Chi tiết</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center" style={{padding: '20px'}}>Chưa có ngựa nào</td></tr>
                            )}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                        <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1F2937'}}>Thêm ngựa mới</h3>
                        <form onSubmit={handleAddHorse}>
                            <div style={{marginBottom: '16px'}}>
                                <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>Tên ngựa</label>
                                <input 
                                    type="text" 
                                    required
                                    style={{width: '100%', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '8px 12px'}}
                                    value={newHorse.name}
                                    onChange={(e) => setNewHorse({...newHorse, name: e.target.value})}
                                    placeholder="Ví dụ: Tía Chớp"
                                />
                            </div>
                            <div style={{marginBottom: '24px'}}>
                                <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>Tuổi</label>
                                <input 
                                    type="number" 
                                    required
                                    min="1"
                                    style={{width: '100%', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '8px 12px'}}
                                    value={newHorse.age}
                                    onChange={(e) => setNewHorse({...newHorse, age: e.target.value})}
                                    placeholder="Ví dụ: 3"
                                />
                            </div>
                            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    style={{padding: '8px 16px', border: '1px solid #D1D5DB', color: '#374151', borderRadius: '6px', backgroundColor: '#F3F4F6', cursor: 'pointer'}}
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    style={{padding: '8px 16px', backgroundColor: isSubmitting ? '#BFDBFE' : '#2563EB', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer'}}
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
