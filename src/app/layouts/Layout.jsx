import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import './Layout.css';

const Layout = ({ children, onLoginClick }) => {
  return (
    <div className="layout">
      <Header onLoginClick={onLoginClick} />
      <main className="layout__main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;