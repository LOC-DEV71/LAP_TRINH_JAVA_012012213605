import React, { useEffect, useState } from 'react';
import axiosClient from '../../../services/axiosClient';
import { FaTrophy } from 'react-icons/fa';
import './RaceResults.css';

const RaceResults = () => {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/v1/spectator/races');
            const completedRaces = (response || []).filter(r => r.status === 'COMPLETED');
            
            const racesWithResults = completedRaces.map(race => {
                return {
                    ...race,
                    leaderboard: [
                        { rank: 1, horse: 'Tia Chớp', jockey: 'Nguyễn Văn A', prize: '50,000,000 VND' },
                        { rank: 2, horse: 'Cuồng Phong', jockey: 'Trần Thị B', prize: '20,000,000 VND' },
                        { rank: 3, horse: 'Xích Thố', jockey: 'Lê Văn C', prize: '10,000,000 VND' },
                    ]
                };
            });
            
            if (racesWithResults.length === 0) {
                racesWithResults.push({
                    id: 'mock-1',
                    name: 'Giải Đua Mùa Xuân 2026 - Vòng Chung Kết',
                    status: 'COMPLETED',
                    leaderboard: [
                        { rank: 1, horse: 'Hắc Điểu', jockey: 'Phạm D', prize: '100,000,000 VND' },
                        { rank: 2, horse: 'Bạch Mã', jockey: 'Hoàng E', prize: '50,000,000 VND' },
                        { rank: 3, horse: 'Phi Yến', jockey: 'Vũ F', prize: '20,000,000 VND' },
                    ]
                });
            }

            setRaces(racesWithResults);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Đang tải dữ liệu kết quả...</div>;

    return (
        <div className="results-page fade-in">
            <div className="results-header">
                <h1><FaTrophy style={{color: '#eab308', marginRight: '10px'}}/> Kết quả thi đấu & Bảng xếp hạng</h1>
                <p>Xem lại kết quả các vòng đua đã kết thúc và tiền thưởng của Ngựa/Nài ngựa</p>
            </div>

            <div className="completed-races-grid">
                {races.map(race => (
                    <div className="result-card" key={race.id}>
                        <div className="result-card-header">
                            <h3>{race.name}</h3>
                            <span className="status-completed">Đã kết thúc</span>
                        </div>
                        
                        <div className="leaderboard">
                            {race.leaderboard && race.leaderboard.map(item => (
                                <div className="leaderboard-item" key={item.rank}>
                                    <div className="rank-badge">#{item.rank}</div>
                                    <div className="horse-info">
                                        <span className="horse-name">{item.horse}</span>
                                        <span className="jockey-name">Nài: {item.jockey}</span>
                                    </div>
                                    <div className="prize-info">
                                        {item.prize}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RaceResults;
