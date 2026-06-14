import React, { useState, useEffect } from 'react';
import axiosClient from '../../services/axiosClient';

const RegistrationApproval = () => {
    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const response = await axiosClient.get('/api/admin/registrations');
            setRegistrations(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đăng ký:", error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axiosClient.put(`/api/admin/registrations/${id}/approve`);
            alert("Đã duyệt đơn đăng ký này!");
            fetchRegistrations();
        } catch (error) {
            console.error("Lỗi khi duyệt đơn:", error);
        }
    };

    const handleAssignReferee = async (id) => {
        const refereeId = prompt("Nhập mã số (ID) Trọng tài muốn phân công:");
        if (!refereeId) return;

        try {
            await axiosClient.put(`/api/admin/registrations/${id}/assign-referee?refereeId=${refereeId}`);
            alert("Phân công trọng tài thành công!");
            fetchRegistrations();
        } catch (error) {
            console.error("Lỗi khi phân công trọng tài:", error);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin: Duyệt Đơn Đăng Ký & Phân Công Trọng Tài</h2>
            
            <div className="bg-white shadow rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Đơn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trọng Tài</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {registrations.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Hiện không có đơn đăng ký nào.</td>
                            </tr>
                        ) : (
                            registrations.map(reg => (
                                <tr key={reg.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{reg.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${reg.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                                              reg.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {reg.status || 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {reg.refereeId ? `ID: ${reg.refereeId}` : <span className="text-gray-400 italic">Chưa phân công</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium flex justify-center gap-3">
                                        {reg.status !== 'APPROVED' && (
                                            <button onClick={() => handleApprove(reg.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-xs">
                                                Duyệt
                                            </button>
                                        )}
                                        <button onClick={() => handleAssignReferee(reg.id)} className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 transition text-xs">
                                            Phân Công Trọng Tài
                                        </button>
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

export default RegistrationApproval;