import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const JockeyDashboard = () => {
    // Mock data
    const invitations = [
        { id: 1, ownerName: 'Trần Văn B', horseName: 'Hắc Yến', race: 'Cúp Mùa Thu', date: '20-10-2026', fee: '5,000,000 VND' },
    ];

    const schedules = [
        { id: 1, horseName: 'Tia Chớp', race: 'Giải Mùa Hè 2026', date: '15-08-2026 14:00', location: 'Trường đua Phú Thọ' },
    ];

    return (
        <div className="dashboard-wrapper fade-in">
            <h2 className="dashboard-title">Bảng điều khiển Nài Ngựa (Jockey)</h2>
            
            <div className="dashboard-section">
                <div className="section-header">
                    <h3>Lời mời thi đấu mới</h3>
                </div>
                <div className="invitation-cards">
                    {invitations.map(inv => (
                        <div key={inv.id} className="invitation-card">
                            <div className="inv-info">
                                <h4>{inv.race}</h4>
                                <p><strong>Chủ ngựa:</strong> {inv.ownerName}</p>
                                <p><strong>Ngựa:</strong> {inv.horseName}</p>
                                <p><strong>Ngày đua:</strong> {inv.date}</p>
                                <p className="inv-fee"><strong>Thù lao dự kiến:</strong> {inv.fee}</p>
                            </div>
                            <div className="inv-actions">
                                <button className="btn-primary btn-sm"><FiCheck /> Chấp nhận</button>
                                <button className="btn-outline btn-sm"><FiX /> Từ chối</button>
                            </div>
                        </div>
                    ))}
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
                            {schedules.map(sch => (
                                <tr key={sch.id}>
                                    <td><strong>{sch.date}</strong></td>
                                    <td>{sch.race}</td>
                                    <td>{sch.horseName}</td>
                                    <td>{sch.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default JockeyDashboard;
