import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../services/axiosClient';

const JockeyDashboard = () => {
    const user = useSelector(state => state.auth.user);
    const jockeyId = user?.id; // hoặc user.jockeyId tùy cấu trúc

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!jockeyId) {
            setError("Không tìm thấy thông tin Jockey.");
            setLoading(false);
            return;
        }

        const fetchSchedule = async () => {
            try {
                const data = await axiosClient.get(`/v1/registrations/jockey/${jockeyId}/schedule`);
                setSchedules(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [jockeyId]);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

    return (
        <div style={{ padding: 20 }}>
            <h2>📅 Lịch trình & Phân công của Jockey</h2>
            {schedules.length === 0 ? (
                <p>Chưa có lịch trình nào.</p>
            ) : (
                <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
                    <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th>Giải đấu</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Ngựa</th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {schedules.map(item => (
                        <tr key={item.registrationId}>
                            <td>{item.tournamentName}</td>
                            <td>{new Date(item.startDate).toLocaleDateString('vi-VN')}</td>
                            <td>{new Date(item.endDate).toLocaleDateString('vi-VN')}</td>
                            <td>{item.horseName}</td>
                            <td>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: 4,
                                    backgroundColor: item.status === 'CONFIRMED' ? '#d4edda' : '#fff3cd',
                                    color: item.status === 'CONFIRMED' ? '#155724' : '#856404'
                                }}>
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default JockeyDashboard;