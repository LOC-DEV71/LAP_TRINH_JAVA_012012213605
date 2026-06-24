import React, { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import axiosClient from '../../../../services/axiosClient';

const JockeyDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [myJockeyId, setMyJockeyId] = useState(null);
    const [invitations, setInvitations] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJockeyData = async () => {
        try {
            setLoading(true);
            const userRes = await axiosClient.get('/auth/me');
            setUserInfo(userRes);

            const jockeysRes = await axiosClient.get('/v1/jockeys');
            const myJockey = jockeysRes.find(j => j.userId === userRes.id);
            
            if (myJockey) {
                setMyJockeyId(myJockey.id);
                fetchSchedules(myJockey.id);
            }
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu Jockey:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSchedules = async (jockeyId) => {
        try {
            const data = await axiosClient.get(`/v1/registrations/jockey/${jockeyId}/schedule`);
            
            // Lọc ra các lời mời chưa duyệt (PENDING)
            const pendingInvs = data.filter(item => item.status === 'PENDING');
            // Lọc ra các lịch trình đã duyệt (ACCEPTED)
            const acceptedSchs = data.filter(item => item.status === 'ACCEPTED');
            
            setInvitations(pendingInvs);
            setSchedules(acceptedSchs);
        } catch (error) {
            console.error("Lỗi khi lấy lịch trình:", error);
        }
    };

    useEffect(() => {
        fetchJockeyData();
    }, []);

    const handleUpdateStatus = async (registrationId, status) => {
        try {
            await axiosClient.put(`/v1/registrations/${registrationId}/status`, { status });
            // Tải lại danh sách
            if (myJockeyId) fetchSchedules(myJockeyId);
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            alert("Có lỗi xảy ra khi cập nhật trạng thái!");
        }
    };

    return (
        <div className="dashboard-wrapper fade-in">
            <h2 className="dashboard-title">Bảng điều khiển Nài Ngựa (Jockey)</h2>
            
            <div className="dashboard-section">
                <div className="section-header">
                    <h3>Lời mời thi đấu mới</h3>
                </div>
                <div className="invitation-cards">
                    {invitations.length > 0 ? invitations.map(inv => (
                        <div key={inv.registrationId} className="invitation-card">
                            <div className="inv-info">
                                <h4>{inv.tournamentName}</h4>
                                <p><strong>Ngựa:</strong> {inv.horseName}</p>
                                <p><strong>Ngày đua:</strong> {new Date(inv.startDate).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <div className="inv-actions">
                                <button className="btn-primary btn-sm" onClick={() => handleUpdateStatus(inv.registrationId, 'ACCEPTED')}>
                                    <FiCheck /> Chấp nhận
                                </button>
                                <button className="btn-outline btn-sm" style={{ color: 'red', borderColor: 'red' }} onClick={() => handleUpdateStatus(inv.registrationId, 'REJECTED')}>
                                    <FiX /> Từ chối
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p style={{ color: '#666' }}>Không có lời mời nào đang chờ duyệt.</p>
                    )}
                </div>
            </div>

            <div className="dashboard-section" style={{marginTop: '30px'}}>
                <div className="section-header">
                    <h3>Lịch trình sắp tới</h3>
                </div>
                <div className="table-responsive">
                    <table className="tm-table">
                        <thead>
                            <tr>
                                <th>Thời gian</th>
                                <th>Giải đấu</th>
                                <th>Ngựa điều khiển</th>
                                <th>Địa điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.length > 0 ? schedules.map(sch => (
                                <tr key={sch.registrationId}>
                                    <td><strong>{new Date(sch.startDate).toLocaleString('vi-VN')}</strong></td>
                                    <td>{sch.tournamentName}</td>
                                    <td>{sch.horseName}</td>
                                    <td><span className="status-badge success">Đã xác nhận</span></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{textAlign: 'center', color: '#666'}}>Chưa có lịch trình thi đấu.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default JockeyDashboard;
