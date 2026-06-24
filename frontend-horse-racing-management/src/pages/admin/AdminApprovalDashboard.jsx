import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/axiosConfig';

const AdminApprovalDashboard = () => {
  const [activeTab, setActiveTab] = useState('APPROVAL'); 

  // Dữ liệu thực từ API
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [races, setRaces] = useState([]);
  const [referees, setReferees] = useState([]);
  
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Lấy đơn chờ duyệt
      const regRes = await apiClient.get('/admin/management/registrations/pending');
      setPendingRegistrations(regRes.data);

      // 2. Lấy chặng đua (Dùng API lấy toàn bộ Race đã có sẵn ở RaceController)
      const raceRes = await apiClient.get('/admin/races');
      setRaces(raceRes.data);

      // 3. Lấy danh sách trọng tài
      const refRes = await apiClient.get('/admin/management/referees');
      setReferees(refRes.data);

    } catch (error) {
      console.error("Lỗi tải dữ liệu Admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Xử lý Duyệt / Từ chối
  const handleApprove = async (id) => {
    if(!window.confirm("Xác nhận DUYỆT đơn đăng ký này?")) return;
    try {
      await apiClient.put(`/admin/management/registrations/${id}/approve`);
      alert("Đã duyệt thành công!");
      fetchDashboardData(); 
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi duyệt đơn!");
    }
  };

  const handleReject = async (id) => {
    if(!window.confirm("Xác nhận TỪ CHỐI đơn đăng ký này?")) return;
    try {
      await apiClient.put(`/admin/management/registrations/${id}/reject`);
      alert("Đã từ chối đơn!");
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi từ chối đơn!");
    }
  };

  // Phân công trọng tài
  const handleAssignReferee = async (raceId, refereeId) => {
    if (!refereeId) {
      alert("Vui lòng chọn một trọng tài từ danh sách!");
      return;
    }
    try {
      await apiClient.put(`/admin/management/races/${raceId}/assign-referee/${refereeId}`);
      alert("Phân công trọng tài thành công!");
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi phân công!");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">Quản Lý Đăng Ký & Trọng Tài</h2>
          </div>
          <div className="flex px-8 gap-6">
            <button 
              className={`pb-4 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'APPROVAL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('APPROVAL')}
            >
              1. Duyệt đơn đăng ký
            </button>
            <button 
              className={`pb-4 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'REFEREE' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('REFEREE')}
            >
              2. Phân công Trọng tài
            </button>
          </div>
        </div>

        {loading && <div className="p-10 text-center text-blue-600 font-bold">Đang đồng bộ dữ liệu hệ thống...</div>}

        {/* TAB 1: DUYỆT ĐƠN */}
        {!loading && activeTab === 'APPROVAL' && (
          <div className="p-8">
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Mã đơn</th>
                    <th className="px-6 py-4">Ngựa đăng ký</th>
                    <th className="px-6 py-4">Giải đấu</th>
                    <th className="px-6 py-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingRegistrations.length > 0 ? pendingRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">#{reg.id}</td>
                      <td className="px-6 py-4">{reg.horse?.name || 'Đang cập nhật'}</td>
                      <td className="px-6 py-4">{reg.tournament?.name || 'Đang cập nhật'}</td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button onClick={() => handleApprove(reg.id)} className="bg-[#10b981] text-white hover:bg-green-600 px-4 py-1.5 rounded-[4px] font-semibold transition-colors">
                          Duyệt
                        </button>
                        <button onClick={() => handleReject(reg.id)} className="bg-[#ef4444] text-white hover:bg-red-600 px-4 py-1.5 rounded-[4px] font-semibold transition-colors">
                          Từ chối
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center py-8 text-gray-500">Tuyệt vời! Đã duyệt hết tất cả đơn đăng ký.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PHÂN CÔNG TRỌNG TÀI */}
        {!loading && activeTab === 'REFEREE' && (
          <div className="p-8">
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Chặng đua</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Chọn Trọng tài</th>
                    <th className="px-6 py-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {races.length > 0 ? races.map((race) => {
                    const [selectedReferee, setSelectedReferee] = React.useState('');
                    return (
                      <tr key={race.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{race.name || `Chặng #${race.id}`}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Chờ trọng tài</span>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            className="border border-gray-300 rounded-[4px] px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                            value={selectedReferee}
                            onChange={(e) => setSelectedReferee(e.target.value)}
                          >
                            <option value="">-- Chọn trọng tài --</option>
                            {referees.map(ref => (
                              <option key={ref.id} value={ref.id}>{ref.fullName}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleAssignReferee(race.id, selectedReferee)} 
                            className="bg-[#3b82f6] text-white hover:bg-blue-600 px-5 py-2 rounded-[4px] font-semibold transition-colors"
                          >
                            Phân công
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="4" className="text-center py-8 text-gray-500">Chưa có dữ liệu chặng đua.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminApprovalDashboard;