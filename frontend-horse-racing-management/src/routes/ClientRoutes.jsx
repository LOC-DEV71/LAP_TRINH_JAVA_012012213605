import React from 'react';
import { Route } from 'react-router-dom';
import ClientLayout from '../layouts/client/ClientLayout';
import PageTitle from '../components/PageTitle';
import Home from '../pages/client/Home';

import Profile from '../pages/client/Profile/Profile';

export const ClientRoutes = (
  <Route path="/" element={<ClientLayout />}>
    <Route index element={<PageTitle title="Stable | EquineElite"><Home /></PageTitle>} />
    <Route path="tournaments" element={<PageTitle title="Marketplace | EquineElite"><div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}><h1>Marketplace</h1></div></PageTitle>} />
    <Route path="races" element={<PageTitle title="Races | EquineElite"><div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}><h1>Races</h1></div></PageTitle>} />
    <Route path="betting" element={<PageTitle title="Predictions | EquineElite"><div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}><h1>Predictions</h1></div></PageTitle>} />
    <Route path="profile" element={<PageTitle title="Hồ Sơ Cá Nhân | EquineElite"><Profile /></PageTitle>} />
  </Route>
);
