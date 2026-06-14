import React from 'react';
import { FiPlus, FiList } from 'react-icons/fi';

const HorseOwnerDashboard = () => {
    // Mock data
    const myHorses = [
        { id: 1, name: 'Tia Chớp', age: 3, wins: 5, status: 'Sẵn sàng' },
        { id: 2, name: 'Bão Táp', age: 4, wins: 2, status: 'Đang nghỉ ngơi' },
    ];

    const jockeyRequests = [
        { id: 1, jockeyName: 'Nguyễn Văn A', horseName: 'Tia Chớp', race: 'Giải Mùa Hè 2026', status: 'Chờ phản hồi' },
    ];

    return (
        <div className="dashboard-wrapper fade-in">
            <h2 className="dashboard-title">Bảng điều khiển Chủ Ngựa</h2>
            
            <div className="dashboard-section">
                <div className="section-header">
                    <h3>Ngựa của tôi</h3>
                    <button className="btn-primary btn-sm"><FiPlus /> Thêm ngựa mới</button>
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
        </div>
    );
};

export default HorseOwnerDashboard;
