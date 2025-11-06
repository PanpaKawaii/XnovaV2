import { Outlet } from "react-router-dom";
import './Layout.css';
import Footer from './UserLayout/Footer/Footer';
import Header from './UserLayout/Header/Header';

const Layout = ({ children, onLoginClick }) => {
  return (
    <div className="layout">
      <Header onLoginClick={onLoginClick} />
      <main className="layout__main">
        {children}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;