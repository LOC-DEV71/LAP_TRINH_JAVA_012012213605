import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AdminLayout from './layouts/admin/AdminLayout';
import ClientLayout from './layouts/client/ClientLayout';
import './Home.css';

const PageTitle = ({ title, children }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return children;
};

const Home = () => (
  <div className="home-container">
    {/* HERO SECTION */}
    <div className="hero-section">
      <div className="hero-content">
        <div className="badge-portal">OWNER PORTAL</div>
        <h1 className="hero-title">The Winner's Circle</h1>
        <p className="hero-subtitle">
          Welcome back, Commander. Your stable is primed for the upcoming Royal Ascot season. Manage your thoroughbreds and hire world-class jockeys.
        </p>
      </div>
      <div className="hero-stats">
        <div className="stat-card">
          <div className="stat-header">TOTAL EARNINGS</div>
          <div className="stat-value">$425,000</div>
          
          <div className="stat-divider"></div>
          
          <div className="stat-header">NEXT UPCOMING RACE</div>
          <div className="race-row">
            <div className="race-info">
              <strong>Royal Ascot G1</strong>
              <span>Today at 2:30 PM</span>
            </div>
            <button className="btn-enter-gate">Enter Gate</button>
          </div>
        </div>
      </div>
    </div>

    {/* CONTENT SECTION */}
    <div className="content-wrapper">
      {/* MY STABLE */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">My Stable</h2>
            <p className="section-desc">Active roster of elite thoroughbreds</p>
          </div>
          <a href="#" className="link-manage">Manage All Horses &rarr;</a>
        </div>
        
        <div className="horse-grid">
          {/* Horse Card 1 */}
          <div className="horse-card">
            <div className="horse-img-container">
              <span className="status-badge active-badge">Active</span>
              <img src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=500&q=80" alt="Horse" className="horse-img" />
            </div>
            <div className="horse-card-content">
              <h3>Thunderbolt</h3>
              <p className="horse-details">4 yrs • Stallion</p>
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Speed</span>
                  <span className="stat-number">98</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Stamina</span>
                  <span className="stat-number">92</span>
                </div>
              </div>
              <button className="btn-outline">View Schedule</button>
            </div>
          </div>

          {/* Horse Card 2 */}
          <div className="horse-card">
            <div className="horse-img-container">
              <span className="status-badge training-badge">In Training</span>
              <img src="https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&w=500&q=80" alt="Horse" className="horse-img" />
            </div>
            <div className="horse-card-content">
              <h3>Midnight Star</h3>
              <p className="horse-details">3 yrs • Filly</p>
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Speed</span>
                  <span className="stat-number">89</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Stamina</span>
                  <span className="stat-number">95</span>
                </div>
              </div>
              <button className="btn-outline">View Schedule</button>
            </div>
          </div>

          {/* Horse Card 3 */}
          <div className="horse-card">
            <div className="horse-img-container">
              <span className="status-badge active-badge">Active</span>
              <img src="https://images.unsplash.com/photo-1534723145455-cb2be994d5ff?auto=format&fit=crop&w=500&q=80" alt="Horse" className="horse-img" />
            </div>
            <div className="horse-card-content">
              <h3>Golden Sovereign</h3>
              <p className="horse-details">5 yrs • Gelding</p>
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Speed</span>
                  <span className="stat-number">94</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Stamina</span>
                  <span className="stat-number">90</span>
                </div>
              </div>
              <button className="btn-outline">View Schedule</button>
            </div>
          </div>
        </div>
      </section>

      {/* JOCKEY MARKETPLACE */}
      <section className="dashboard-section mt-40">
        <div className="section-header">
          <div>
            <h2 className="section-title">Jockey Hiring Marketplace</h2>
            <p className="section-desc">Top-rated jockeys available for your next race event</p>
          </div>
          <div className="filter-actions">
            <button className="btn-filter">Filter</button>
            <button className="btn-filter">Rank</button>
          </div>
        </div>
        
        <div className="jockey-list">
          {/* Jockey Row 1 */}
          <div className="jockey-row">
            <div className="jockey-profile">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Jockey" />
              <div className="jockey-info">
                <h4>Julian Vance</h4>
                <p>🏆 42 Wins • 📍 UK Circuit</p>
              </div>
            </div>
            <div className="jockey-stats">
              <div className="stat-col">
                <span className="col-label">Win Rate</span>
                <span className="col-value">22%</span>
              </div>
              <div className="stat-col">
                <span className="col-label">Exp. Fee</span>
                <span className="col-value">$1,200</span>
              </div>
              <button className="btn-invite">Invite to Race</button>
            </div>
          </div>

          {/* Jockey Row 2 */}
          <div className="jockey-row">
            <div className="jockey-profile">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" alt="Jockey" />
              <div className="jockey-info">
                <h4>Elena Rossi</h4>
                <p>🏆 38 Wins • 📍 EU Circuit</p>
              </div>
            </div>
            <div className="jockey-stats">
              <div className="stat-col">
                <span className="col-label">Win Rate</span>
                <span className="col-value">18%</span>
              </div>
              <div className="stat-col">
                <span className="col-label">Exp. Fee</span>
                <span className="col-value">$950</span>
              </div>
              <button className="btn-invite">Invite to Race</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

const AdminDashboard = () => <div><h2>Tổng quan hệ thống</h2><p>Đây là giao diện dành riêng cho Admin.</p></div>;
const NotFound = () => <div style={{ padding: '20px', textAlign: 'center' }}><h1>404 - Không tìm thấy trang</h1></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<PageTitle title="Stable | EquineElite"><Home /></PageTitle>} />
          <Route path="tournaments" element={<PageTitle title="Marketplace | EquineElite"><div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}><h1>Marketplace</h1></div></PageTitle>} />
          <Route path="races" element={<PageTitle title="Races | EquineElite"><div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}><h1>Races</h1></div></PageTitle>} />
          <Route path="betting" element={<PageTitle title="Predictions | EquineElite"><div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}><h1>Predictions</h1></div></PageTitle>} />
        </Route>

        <Route path="/admin" element={<PageTitle title="Admin Portal | EquineElite"><AdminLayout /></PageTitle>}>
          <Route index element={<PageTitle title="Dashboard | Admin"><AdminDashboard /></PageTitle>} />
          <Route path="users" element={<PageTitle title="User Management | Admin"><div><h2>User Management</h2></div></PageTitle>} />
          <Route path="tournaments" element={<PageTitle title="Tournaments | Admin"><div><h2>Tournaments</h2></div></PageTitle>} />
          <Route path="horses" element={<PageTitle title="Entities Management | Admin"><div><h2>Entities Management</h2></div></PageTitle>} />
        </Route>

        <Route path="*" element={<PageTitle title="404 Not Found"><NotFound /></PageTitle>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
