import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import './ownerLayout.css';

const OwnerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="owner-layout">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="owner-layout-container">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          onSidebarClose={() => setSidebarOpen(false)}
        />
        <main className="owner-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;