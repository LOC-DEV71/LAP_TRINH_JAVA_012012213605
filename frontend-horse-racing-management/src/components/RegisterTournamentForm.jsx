import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterTournamentForm = () => {
    // 1. Thêm State quản lý danh sách Jockey
    const [tournaments, setTournaments] = useState([]);
    const [horses, setHorses] = useState([]);
    const [jockeys, setJockeys] = useState([]); // <--- Thêm mới

    // 2. Thêm jockeyId vào Form Data gửi lên Backend
    const [formData, setFormData] = useState({
        tournamentId: '',
        horseId: '',
        jockeyId: '' // <--- Thêm mới
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    // 3. Tự động gọi API lấy thêm danh sách Jockey khi mở trang
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/tournaments')
            .then(res => setTournaments(res.data))
            .catch(err => console.error("Lỗi lấy danh sách giải đấu:", err));

        axios.get('http://localhost:8080/api/v1/horses')
            .then(res => setHorses(res.data))
            .catch(err => console.error("Lỗi lấy danh sách ngựa:", err));

        // API lấy danh sách Jockey (Hãy check lại endpoint đúng của nhóm bạn nhé)
        axios.get('http://localhost:8080/api/v1/jockeys')
            .then(res => setJockeys(res.data))
            .catch(err => console.error("Lỗi lấy danh sách Jockey:", err));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Cập nhật Validator bắt buộc chọn cả Jockey
        if (!formData.tournamentId || !formData.horseId || !formData.jockeyId) {
            setIsError(true);
            setMessage("Vui lòng chọn đầy đủ giải đấu, con ngựa và nài ngựa (Jockey)!");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:8080/api/v1/registrations/register', formData);
            setIsError(false);
            setMessage(`🎉 Đăng ký giải đấu & Gửi lời mời Jockey thành công!`);
            setFormData({ tournamentId: '', horseId: '', jockeyId: '' });
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data || "Đã có lỗi xảy ra khi xử lý đăng ký!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#004d40', marginBottom: '20px' }}>Đăng Ký Giải Đấu & Mời Jockey</h2>

            <form onSubmit={handleSubmit}>
                {/* Chọn Giải Đấu */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Chọn Giải Đấu:</label>
                    <select name="tournamentId" value={formData.tournamentId} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="">-- Chọn Giải Đấu --</option>
                        {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>

                {/* Chọn Ngựa */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Chọn Ngựa Thi Đấu:</label>
                    <select name="horseId" value={formData.horseId} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="">-- Chọn Con Ngựa --</option>
                        {horses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                </div>

                {/* THÊM MỚI: Chọn Jockey để gửi lời mời */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Gửi Lời Mời Jockey (Nài Ngựa):</label>
                    <select name="jockeyId" value={formData.jockeyId} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="">-- Chọn Jockey Muốn Mời --</option>
                        {jockeys.map(j => <option key={j.id} value={j.id}>{j.name} (KN: {j.experience} năm)</option>)}
                    </select>
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                    {loading ? 'Đang xử lý...' : 'Xác Nhận Đăng Ký & Gửi Lời Mời'}
                </button>
            </form>

            {message && (
                <div style={{ marginTop: '15px', padding: '12px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: isError ? '#f8d7da' : '#d4edda', color: isError ? '#721c24' : '#155724' }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default RegisterTournamentForm;