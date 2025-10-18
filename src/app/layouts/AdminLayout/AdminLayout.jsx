import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../AdminLayout/Slidebar/Sidebar';
import { Header } from '../AdminLayout/Header/Header';
import './AdminLayout.css';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ad-admin-layout">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="ad-admin-layout__content">
        <Header />
        <main className="ad-admin-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
