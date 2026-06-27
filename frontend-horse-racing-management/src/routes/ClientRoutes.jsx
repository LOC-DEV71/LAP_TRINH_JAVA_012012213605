import React from 'react';
import { Route } from 'react-router-dom';
import ClientLayout from '../layouts/client/ClientLayout';
import PageTitle from '../components/PageTitle';
import Home from '../pages/client/Home';

import Profile from '../pages/client/Profile/Profile';

import GeneralInfo from '../pages/client/Profile/components/GeneralInfo';
import Security from '../pages/client/Profile/components/Security';
import HorseOwnerDashboard from '../pages/client/Profile/dashboards/HorseOwnerDashboard';
import JockeyDashboard from '../pages/client/Profile/dashboards/JockeyDashboard';
import RefereeDashboard from '../pages/client/Profile/dashboards/RefereeDashboard';
import SpectatorDashboard from '../pages/client/Profile/dashboards/SpectatorDashboard';

import Tournaments from '../pages/client/Tournaments/Tournaments';
import TournamentDetails from '../pages/client/Tournaments/TournamentDetails';
import Races from '../pages/client/Races/Races';
import RaceDetails from '../pages/client/Races/RaceDetails';
import HorseDetails from '../pages/client/Horses/HorseDetails';
import LiveBetting from '../pages/client/SpectatorDashboard/LiveBetting';

export const ClientRoutes = (
  <Route path="/" element={<ClientLayout />}>
    <Route index element={<PageTitle title="Stable | EquineElite"><Home /></PageTitle>} />
    <Route path="tournaments" element={<PageTitle title="Giải Đấu | EquineElite"><Tournaments /></PageTitle>} />
    <Route path="tournaments/:id" element={<PageTitle title="Chi Tiết Giải Đấu | EquineElite"><TournamentDetails /></PageTitle>} />
    <Route path="races" element={<PageTitle title="Lịch Đua | EquineElite"><Races /></PageTitle>} />
    <Route path="races/:id" element={<PageTitle title="Chi Tiết Vòng Đua | EquineElite"><RaceDetails /></PageTitle>} />
    <Route path="horses/:id" element={<PageTitle title="Chi Tiết Ngựa | EquineElite"><HorseDetails /></PageTitle>} />
    <Route path="betting" element={<PageTitle title="Dự Đoán | EquineElite"><LiveBetting /></PageTitle>} />
    
    <Route path="profile" element={<PageTitle title="Hồ Sơ Cá Nhân | EquineElite"><Profile /></PageTitle>}>
      <Route index element={<GeneralInfo />} />
      <Route path="security" element={<Security />} />
      <Route path="owner-dashboard" element={<HorseOwnerDashboard />} />
      <Route path="jockey-dashboard" element={<JockeyDashboard />} />
      <Route path="referee-dashboard" element={<RefereeDashboard />} />
      <Route path="spectator-dashboard" element={<SpectatorDashboard />} />
    </Route>
  </Route>
);
