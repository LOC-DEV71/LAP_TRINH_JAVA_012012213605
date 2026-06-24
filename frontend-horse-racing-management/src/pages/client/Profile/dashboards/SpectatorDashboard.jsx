import React from 'react';
import { FiTrendingUp, FiGift } from 'react-icons/fi';

const SpectatorDashboard = () => {
    // Mock data
    const betHistory = [
        { id: 1, race: 'Chung kết Mùa Hè 2026', horse: 'Tia Chớp', amount: '500,000 VND', result: 'Thắng', prize: '1,500,000 VND', date: '15-08-2026' },
        { id: 2, race: 'Vòng loại 2 Cúp Mùa Thu', horse: 'Bão Táp', amount: '200,000 VND', result: 'Thua', prize: '0 VND', date: '18-10-2026' },
    ];

    return (
        <div className="dashboard-wrapper fade-in">
            <h2 className="dashboard-title">Bảng điều khiển Khán Giả</h2>
            
            <div className="profile-side-column" style={{display: 'flex', gap: '20px', marginBottom: '30px'}}>
                <div className="profile-card side-card" style={{flex: 1}}>
                    <h4 className="side-card-title">Tổng tiền cược</h4>
                    <div className="balance-display">
                        <span className="balance-amount">700,000 <small>VND</small></span>
                    </div>
                </div>
                <div className="profile-card side-card" style={{flex: 1}}>
                    <h4 className="side-card-title">Tổng tiền thắng</h4>
                    <div className="balance-display" style={{color: '#10b981'}}>
                        <span className="balance-amount">1,500,000 <small>VND</small></span>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <h3>Lịch sử dự đoán (Betting)</h3>
                    <button className="btn-outline btn-sm"><FiTrendingUp /> Thống kê</button>
                </div>
                <div className="table-responsive">
                    <table className="tm-table">
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Cuộc đua</th>
                                <th>Ngựa dự đoán</th>
                                <th>Số tiền cược</th>
                                <th>Kết quả</th>
                                <th>Tiền thưởng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {betHistory.map(bet => (
                                <tr key={bet.id}>
                                    <td>{bet.date}</td>
                                    <td><strong>{bet.race}</strong></td>
                                    <td>{bet.horse}</td>
                                    <td>{bet.amount}</td>
                                    <td>
                                        <span className={`profile-status-badge ${bet.result === 'Thắng' ? 'success' : 'danger'}`}>
                                            {bet.result}
                                        </span>
                                    </td>
                                    <td style={{color: bet.result === 'Thắng' ? '#10b981' : 'inherit', fontWeight: 'bold'}}>
                                        {bet.prize}
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

export default SpectatorDashboard;
