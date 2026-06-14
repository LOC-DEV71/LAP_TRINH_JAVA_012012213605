import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../../services/axiosClient';
import { FiCalendar, FiClock, FiMapPin, FiActivity, FiArrowLeft, FiAward } from 'react-icons/fi';
import './TournamentDetails.css';

const TournamentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(null);
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTournamentData();
    }, [id]);

    const fetchTournamentData = async () => {
        setLoading(true);
        try {
            // Fetch tournament details
            const tournamentData = await axiosClient.get(`/admin/tournaments/${id}`);
            setTournament(tournamentData);

            // Fetch races for this tournament
            try {
                const racesData = await axiosClient.get(`/admin/races/tournament/${id}`);
                setRaces(racesData);
            } catch (raceErr) {
                console.error('Không tìm thấy cuộc đua nào cho giải này hoặc lỗi API', raceErr);
                setRaces([]);
            }

        } catch (err) {
            console.error('Lỗi khi lấy thông tin giải đấu:', err);
            setError('Không thể tải thông tin giải đấu. Có thể giải đấu không tồn tại.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) + ' ' + 
               date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'SCHEDULED': return 'Đã lên lịch';
            case 'UPCOMING': return 'Sắp diễn ra';
            case 'ONGOING': return 'Đang diễn ra';
            case 'COMPLETED': return 'Đã kết thúc';
            case 'CANCELLED': return 'Đã hủy';
            case 'POSTPONED': return 'Đã hoãn';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="td-container">
                <div className="td-loading">
                    <div className="spinner"></div>
                    <p>Đang tải thông tin giải đấu...</p>
                </div>
            </div>
        );
    }

    if (error || !tournament) {
        return (
            <div className="td-container">
                <button className="btn-ghost mb-4" onClick={() => navigate('/tournaments')}>
                    <FiArrowLeft /> Quay lại danh sách
                </button>
                <div className="td-error">{error || 'Không tìm thấy giải đấu.'}</div>
            </div>
        );
    }

    return (
        <div className="td-container fade-in">
            <button className="btn-ghost mb-4" onClick={() => navigate('/tournaments')}>
                <FiArrowLeft /> Quay lại
            </button>

            <div className="td-header-banner">
                <div className="td-header-content">
                    <div className="td-status-badge">
                        {getStatusText(tournament.status)}
                    </div>
                    <h1 className="td-title">{tournament.name}</h1>
                    <p className="td-description">{tournament.description || 'Giải đua ngựa chuyên nghiệp với sự tham gia của các đội đua hàng đầu.'}</p>
                    
                    <div className="td-meta-bar">
                        <div className="td-meta-item">
                            <FiCalendar /> Bắt đầu: {formatDate(tournament.startDate)}
                        </div>
                        <div className="td-meta-item">
                            <FiClock /> Kết thúc: {formatDate(tournament.endDate)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="td-section">
                <h2 className="td-section-title">
                    <FiAward className="title-icon" /> Lịch Cuộc Đua ({races.length})
                </h2>
                
                {races.length === 0 ? (
                    <div className="no-races-card">
                        <FiActivity size={40} className="mb-2" />
                        <p>Chưa có cuộc đua nào được lên lịch cho giải đấu này.</p>
                    </div>
                ) : (
                    <div className="td-races-grid">
                        {races.map(race => (
                            <div key={race.id} className="td-race-card">
                                <div className="td-race-time">
                                    <span className="td-race-time-big">{new Date(race.startTime).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
                                    <span className="td-race-time-small">{new Date(race.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="td-race-info">
                                    <h3 className="td-race-name">{race.name}</h3>
                                    <div className="td-race-details">
                                        <span><FiMapPin /> Cự ly: {race.distance ? race.distance + 'm' : 'Đang cập nhật'}</span>
                                        <span>Trạng thái: <strong>{getStatusText(race.status)}</strong></span>
                                    </div>
                                </div>
                                <div className="td-race-action">
                                    <button className="btn-outline btn-sm">Xem Vòng Đua</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TournamentDetails;
