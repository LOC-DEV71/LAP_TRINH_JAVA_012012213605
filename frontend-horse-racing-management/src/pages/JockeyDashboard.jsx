import { useState, useEffect } from 'react';
import axios from 'axios';

const JockeyDashboard = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ⚠️ THAY ID NÀY BẰNG ID THỰC TẾ CỦA JOCKEY TRONG DATABASE CỦA BẠN
    const jockeyId = '65f3a1b2c3d4e5f6g7h8i9j3';

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/registrations/jockey/${jockeyId}/schedule`);
                setSchedules(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [jockeyId]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Đang tải lịch trình...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>Lỗi: {error}</div>;

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