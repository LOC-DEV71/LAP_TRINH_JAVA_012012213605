import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../services/axiosClient';
import { FiCalendar, FiClock, FiMapPin, FiActivity } from 'react-icons/fi';
import './Races.css';

const Races = () => {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRaces();
    }, []);

    const fetchRaces = async () => {
        try {
            const data = await axiosClient.get('/admin/races');
            setRaces(data);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách cuộc đua:', err);
            setError('Không thể tải danh sách cuộc đua. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + 
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

    const getStatusClass = (status) => {
        switch (status) {
            case 'SCHEDULED': return 'race-status-upcoming';
            case 'UPCOMING': return 'race-status-upcoming';
            case 'ONGOING': return 'race-status-ongoing';
            case 'COMPLETED': return 'race-status-completed';
            case 'CANCELLED': return 'race-status-completed';
            case 'POSTPONED': return 'race-status-upcoming';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="races-container">
                <div className="races-loading">
                    <div className="spinner"></div>
                    <p>Đang tải lịch đua...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="races-container">
                <div className="races-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="races-container fade-in">
            <div className="races-header">
                <h1 className="races-title">Lịch Đua Chuyên Nghiệp</h1>
                <p className="races-subtitle">Theo dõi lịch trình các vòng đua gay cấn nhất từ mọi giải đấu.</p>
            </div>

            {races.length === 0 ? (
                <div className="no-races">
                    <FiActivity size={48} />
                    <p>Hiện chưa có cuộc đua nào được lên lịch.</p>
                </div>
            ) : (
                <div className="races-list">
                    {races.map((race) => (
                        <div key={race.id} className="race-list-item">
                            <div className="race-datetime">
                                <div className="race-date">{new Date(race.startTime).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                                <div className="race-time">{new Date(race.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            
                            <div className="race-main-info">
                                <div className="race-tags">
                                    <span className={`race-status ${getStatusClass(race.status)}`}>
                                        {getStatusText(race.status)}
                                    </span>
                                </div>
                                <h3 className="race-name">{race.name}</h3>
                                <div className="race-meta">
                                    <span className="race-meta-item"><FiMapPin /> Cự ly: {race.distance ? race.distance + 'm' : 'Đang cập nhật'}</span>
                                    {race.tournamentName && (
                                        <span className="race-meta-item"><FiCalendar /> Giải: {race.tournamentName}</span>
                                    )}
                                </div>
                            </div>

                            <div className="race-actions">
                                <button className="btn-outline" onClick={() => navigate(`/races/${race.id}`)}>
                                    Chi Tiết Vòng Đua
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Races;
