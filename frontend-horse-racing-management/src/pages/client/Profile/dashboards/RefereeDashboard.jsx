import React from 'react';
import { FiEdit3, FiAlertCircle } from 'react-icons/fi';

const RefereeDashboard = () => {
    // Mock data
    const assignedRaces = [
        { id: 1, name: 'Vòng loại 1 - Cúp Mùa Thu', date: '20-10-2026 08:00', location: 'Trường đua A', status: 'Sắp diễn ra' },
        { id: 2, name: 'Chung kết - Giải Mùa Hè', date: '15-08-2026 14:00', location: 'Trường đua Phú Thọ', status: 'Đã hoàn thành' },
    ];

    return (
        <div className="dashboard-wrapper fade-in">
            <h2 className="dashboard-title">Bảng điều khiển Trọng Tài</h2>
            
            <div className="dashboard-section">
                <div className="section-header">
                    <h3>Lịch phân công giám sát</h3>
                </div>
                <div className="table-responsive">
                    <table className="tm-table">
                        <thead>
                            <tr>
                                <th>Thời gian</th>
                                <th>Tên cuộc đua</th>
                                <th>Địa điểm</th>
                                <th>Trạng thái</th>
                                <th>Nhiệm vụ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignedRaces.map(race => (
                                <tr key={race.id}>
                                    <td><strong>{race.date}</strong></td>
                                    <td>{race.name}</td>
                                    <td>{race.location}</td>
                                    <td>
                                        <span className={`profile-status-badge ${race.status === 'Đã hoàn thành' ? 'success' : 'pending'}`}>
                                            {race.status}
                                        </span>
                                    </td>
                                    <td>
                                        {race.status === 'Đã hoàn thành' ? (
                                            <button className="btn-outline btn-sm">Xem biên bản</button>
                                        ) : (
                                            <button className="btn-primary btn-sm"><FiEdit3 /> Lập biên bản</button>
                                        )}
                                        <button className="btn-secondary btn-sm" style={{marginLeft: '5px'}}><FiAlertCircle /> Ghi nhận vi phạm</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RefereeDashboard;
