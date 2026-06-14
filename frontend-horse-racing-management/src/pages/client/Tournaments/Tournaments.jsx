import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../services/axiosClient';
import { FiCalendar, FiClock, FiActivity } from 'react-icons/fi';
import './Tournaments.css';

const Tournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const data = await axiosClient.get('/admin/tournaments');
            setTournaments(data);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách giải đấu:', err);
            setError('Không thể tải danh sách giải đấu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'UPCOMING': return 'Sắp diễn ra';
            case 'ONGOING': return 'Đang diễn ra';
            case 'COMPLETED': return 'Đã kết thúc';
            default: return status;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'UPCOMING': return 'status-upcoming';
            case 'ONGOING': return 'status-ongoing';
            case 'COMPLETED': return 'status-completed';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="tournaments-container">
                <div className="tournaments-loading">
                    <div className="spinner"></div>
                    <p>Đang tải danh sách giải đấu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tournaments-container">
                <div className="tournaments-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="tournaments-container fade-in">
            <div className="tournaments-header">
                <div>
                    <h1 className="tournaments-title">Giải Đấu Nổi Bật</h1>
                    <p className="tournaments-subtitle">Khám phá và tham gia các giải đấu đua ngựa hấp dẫn nhất mùa giải này.</p>
                </div>
            </div>

            {tournaments.length === 0 ? (
                <div className="no-tournaments">
                    <FiActivity size={48} />
                    <p>Hiện chưa có giải đấu nào trong hệ thống.</p>
                </div>
            ) : (
                <div className="tournaments-grid">
                    {tournaments.map((tournament) => (
                        <div key={tournament.id} className="tournament-card">
                            <div className="tournament-card-header">
                                <span className={`tournament-status ${getStatusClass(tournament.status)}`}>
                                    {getStatusText(tournament.status)}
                                </span>
                            </div>
                            <div className="tournament-card-body">
                                <h3 className="tournament-name">{tournament.name}</h3>
                                <p className="tournament-desc">
                                    {tournament.description || 'Chưa có thông tin mô tả cho giải đấu này.'}
                                </p>
                                
                                <div className="tournament-meta">
                                    <div className="meta-item">
                                        <FiCalendar className="meta-icon" />
                                        <span>Bắt đầu: <strong>{formatDate(tournament.startDate)}</strong></span>
                                    </div>
                                    <div className="meta-item">
                                        <FiClock className="meta-icon" />
                                        <span>Kết thúc: <strong>{formatDate(tournament.endDate)}</strong></span>
                                    </div>
                                </div>
                            </div>
                            <div className="tournament-card-footer">
                                <button className="btn-primary w-100" onClick={() => navigate(`/tournaments/${tournament.id}`)}>Xem Chi Tiết</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tournaments;
