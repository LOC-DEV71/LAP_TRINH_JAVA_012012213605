import React, { useState, useEffect } from 'react';
import axiosClient from '../../services/axiosClient';

const HorseManagement = () => {
    const [horses, setHorses] = useState([]);
    const [horseName, setHorseName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const ownerId = "owner_mock_123"; // ID mẫu (Sẽ thay bằng id từ login context sau này)

    useEffect(() => {
        fetchHorses();
    }, []);

    const fetchHorses = async () => {
        try {
            const response = await axiosClient.get(`/api/horses/owner/${ownerId}`);
            setHorses(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách ngựa:", error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!horseName.trim()) return;

        try {
            if (editingId) {
                await axiosClient.put(`/api/horses/${editingId}`, { name: horseName });
                alert("Cập nhật thông tin ngựa thành công!");
            } else {
                await axiosClient.post('/api/horses', { name: horseName, ownerId: ownerId });
                alert("Thêm ngựa mới thành công!");
            }
            setHorseName('');
            setEditingId(null);
            fetchHorses();
        } catch (error) {
            console.error("Lỗi khi lưu thông tin ngựa:", error);
        }
    };

    const handleEdit = (horse) => {
        setHorseName(horse.name);
        setEditingId(horse.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa ngựa này không?")) {
            try {
                await axiosClient.delete(`/api/horses/${id}`);
                alert("Xóa thành công!");
                fetchHorses();
            } catch (error) {
                console.error("Lỗi khi xóa ngựa:", error);
            }
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản Lý Danh Sách Ngựa Của Tôi</h2>
            
            <form onSubmit={handleSave} className="mb-8 bg-gray-50 p-4 rounded shadow-sm flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên Ngựa</label>
                    <input 
                        type="text" 
                        value={horseName}
                        onChange={(e) => setHorseName(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên con ngựa..."
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                    {editingId ? "Cập nhật" : "Thêm mới"}
                </button>
                {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setHorseName(''); }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                        Hủy
                    </button>
                )}
            </form>

            <div className="bg-white shadow rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Ngựa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Ngựa</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {horses.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Chưa có con ngựa nào được đăng ký.</td>
                            </tr>
                        ) : (
                            horses.map(horse => (
                                <tr key={horse.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{horse.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{horse.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                                        <button onClick={() => handleEdit(horse)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
                                        <button onClick={() => handleDelete(horse.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HorseManagement;