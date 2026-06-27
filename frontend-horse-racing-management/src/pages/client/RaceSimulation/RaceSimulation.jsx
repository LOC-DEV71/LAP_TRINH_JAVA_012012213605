import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../../../service/axiosClient';
import './RaceSimulation.css';

const RaceSimulation = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();

  const [race, setRace] = useState(null);
  const [horses, setHorses] = useState([]);
  
  // Simulation States
  const [status, setStatus] = useState('READY'); // READY, COUNTDOWN, RACING, FINISHED
  const [countdown, setCountdown] = useState(3);
  const [leaderboard, setLeaderboard] = useState([]);
  const [violations, setViolations] = useState([]);
  
  // Track horse progress (0 to 100)
  const [progress, setProgress] = useState({});
  
  // Ref for the animation loop
  const intervalRef = useRef(null);
  
  const finishLineX = 90; // 90% of container width to leave space for the avatar

  useEffect(() => {
    fetchRaceData();
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [raceId]);

  const fetchRaceData = async () => {
    try {
      // For demo, we might use referee endpoint if admin/referee, but we assume spectator can also view simulation
      // If CORS or role block, we might need a public endpoint. Let's try the referee endpoint first or just get from races
      const raceRes = await axiosClient.get(`/v1/spectator/races`);
      const currentRace = raceRes?.find(r => r.id === raceId);
      setRace(currentRace);
      
      // Get horses for this race. Since we don't have a public endpoint for race horses, 
      // we'll try the referee one. If it fails due to auth, we fallback to all horses and pick some randomly.
      try {
          const horsesRes = await axiosClient.get(`/referee/race/${raceId}/horses`);
          const initialProgress = {};
          horsesRes.forEach(h => {
              initialProgress[h.horseId] = { x: 0, finished: false, time: null, horse: h };
          });
          setHorses(horsesRes);
          setProgress(initialProgress);
      } catch (err) {
          console.warn("Could not fetch horses from referee endpoint, using mock data from general horses");
          const allHorses = await axiosClient.get(`/v1/horses`);
          const mockHorses = allHorses.slice(0, 5).map(h => ({ horseId: h.id, horseName: h.name, jockeyId: 'jockey-1', jockeyName: 'Mock Jockey' }));
          
          const initialProgress = {};
          mockHorses.forEach(h => {
              initialProgress[h.horseId] = { x: 0, finished: false, time: null, horse: h };
          });
          setHorses(mockHorses);
          setProgress(initialProgress);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đua:", error);
    }
  };

  const startSimulation = () => {
    if (horses.length === 0) {
        alert("Không có ngựa nào tham gia!");
        return;
    }
    
    setStatus('COUNTDOWN');
    setCountdown(3);
    setLeaderboard([]);
    setViolations([]);
    
    // Pick 1 random horse to false start
    const falseStartHorseIndex = Math.floor(Math.random() * horses.length);
    const falseStartHorseId = horses[falseStartHorseIndex].horseId;
    
    let currentCount = 3;
    
    const countInterval = setInterval(() => {
      currentCount -= 1;
      setCountdown(currentCount);
      
      // Simulate FALSE START at count 1
      if (currentCount === 1) {
          setProgress(prev => ({
              ...prev,
              [falseStartHorseId]: { ...prev[falseStartHorseId], x: 10, isFalseStart: true }
          }));
          
          // Log violation to backend
          reportFalseStart(horses[falseStartHorseIndex]);
      }
      
      if (currentCount === 0) {
        clearInterval(countInterval);
        setStatus('RACING');
        startRacing(falseStartHorseId);
      }
    }, 1000);
  };

  const reportFalseStart = async (horseData) => {
      const violationMsg = `Lỗi XUẤT PHÁT SỚM: Ngựa ${horseData.horseName} cố tình chạy trước khi có hiệu lệnh.`;
      setViolations(prev => [...prev, violationMsg]);
      
      try {
          await axiosClient.post(`/referee/race/${raceId}/violation`, {
              horseId: horseData.horseId,
              jockeyId: horseData.jockeyId,
              violationType: 'FALSE_START',
              description: violationMsg,
              penalty: 500000,
              severity: 'HIGH',
              refereeId: 'system_auto'
          });
          console.log("Đã gửi biên bản vi phạm lên hệ thống Referee!");
      } catch (err) {
          console.error("Gửi vi phạm thất bại", err);
      }
  };

  const startRacing = (falseStartHorseId) => {
    const startTime = Date.now();
    let currentLeaderboard = [];
    
    intervalRef.current = setInterval(() => {
        setProgress(prev => {
            const newProgress = { ...prev };
            let allFinished = true;
            
            Object.keys(newProgress).forEach(hId => {
                const horseState = newProgress[hId];
                
                if (!horseState.finished) {
                    allFinished = false;
                    // Random speed bump between 0.5 and 2.5
                    const speed = Math.random() * 2.0 + 0.5; 
                    let newX = horseState.x + speed;
                    
                    if (newX >= finishLineX) {
                        newX = finishLineX;
                        horseState.finished = true;
                        horseState.time = ((Date.now() - startTime) / 1000).toFixed(2);
                        
                        // Add to leaderboard
                        currentLeaderboard.push({
                            ...horseState.horse,
                            finishTime: horseState.time,
                            position: currentLeaderboard.length + 1
                        });
                        setLeaderboard([...currentLeaderboard]);
                    }
                    
                    horseState.x = newX;
                }
            });
            
            if (allFinished) {
                clearInterval(intervalRef.current);
                setStatus('FINISHED');
                finalizeRace(currentLeaderboard);
            }
            
            return newProgress;
        });
    }, 100); // 10 ticks per second
  };

  const finalizeRace = async (finalBoard) => {
      try {
          // 1. Submit results for all horses
          for (const result of finalBoard) {
              await axiosClient.post(`/referee/race/${raceId}/result`, {
                  horseId: result.horseId,
                  jockeyId: result.jockeyId,
                  position: result.position,
                  finishTime: parseFloat(result.finishTime)
              });
          }
          console.log("Đã chốt kết quả đua!");
          
          // 2. Trigger automated rewards!
          await axiosClient.post(`/v1/rewards/calculate/${raceId}`);
          alert("Cuộc đua kết thúc! Hệ thống đã tính thưởng và cộng tiền cho khán giả đoán trúng!");
          
      } catch (error) {
          console.error("Lỗi khi chốt kết quả/tính thưởng:", error);
          alert("Cuộc đua kết thúc nhưng có lỗi khi chốt tiền thưởng.");
      }
  };

  const renderHorseEmoji = (index) => {
      const emojis = ['🐎', '🐴', '🦄', '🏇'];
      return emojis[index % emojis.length];
  };

  return (
    <div className="race-simulation-container">
      <div className="race-simulation-header">
        <h2>Trường Đua Giả Lập</h2>
        <p className="race-status">
            {status === 'READY' && 'Sẵn sàng khởi tranh'}
            {status === 'COUNTDOWN' && 'Chuẩn bị...'}
            {status === 'RACING' && 'Đang đua!'}
            {status === 'FINISHED' && 'Cuộc đua kết thúc!'}
        </p>
        
        {status === 'COUNTDOWN' && (
            <div className="countdown-display">{countdown}</div>
        )}
        
        {status === 'READY' && (
            <button className="start-button" onClick={startSimulation}>
                Bắt Đầu Mô Phỏng Đua
            </button>
        )}
        
        {status === 'FINISHED' && (
            <button className="start-button" onClick={() => navigate(-1)} style={{ background: '#3b82f6' }}>
                Quay Lại
            </button>
        )}
      </div>

      <div className="track-container">
        <div className="finish-line"></div>
        
        {horses.map((horse, index) => {
            const hState = progress[horse.horseId] || { x: 0 };
            return (
                <div key={horse.horseId} className="horse-lane">
                    <div 
                        className={`horse-avatar ${hState.isFalseStart ? 'false-start' : ''}`}
                        style={{ left: `${hState.x}%` }}
                    >
                        {renderHorseEmoji(index)}
                        <span className="horse-info-badge">{horse.horseName}</span>
                    </div>
                </div>
            );
        })}
      </div>

      {violations.length > 0 && (
          <div className="violations-container" style={{ marginBottom: '20px' }}>
              {violations.map((v, i) => (
                  <div key={i} className="violation-alert">
                      <strong>⚠️ PHẠT NGUỘI:</strong> {v}
                  </div>
              ))}
          </div>
      )}

      {leaderboard.length > 0 && (
          <div className="leaderboard">
              <h3>🏆 Bảng Xếp Hạng Chung Cuộc</h3>
              <ul className="leaderboard-list">
                  {leaderboard.map((item) => (
                      <li key={item.horseId} className="leaderboard-item">
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span className={`rank-badge rank-${item.position > 3 ? 'other' : item.position}`}>
                                  {item.position}
                              </span>
                              <strong>{item.horseName}</strong>
                              <span style={{ color: '#64748b', marginLeft: '10px', fontSize: '0.9rem' }}>
                                  (Nài: {item.jockeyName || 'Chưa rõ'})
                              </span>
                          </div>
                          <span className="finish-time">{item.finishTime}s</span>
                      </li>
                  ))}
              </ul>
          </div>
      )}
    </div>
  );
};

export default RaceSimulation;
