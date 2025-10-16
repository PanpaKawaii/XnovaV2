import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Slidebar/Sidebar';
import Header from './Header/Header';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="app">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <div className="main">
        <header className="header">
          <Header />
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;