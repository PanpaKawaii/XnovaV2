import { ReactNode } from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';

interface LayoutProps {
  children: ReactNode;
  onLoginClick: () => void;
}

const Layout = ({ children, onLoginClick }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg via-gray-50 to-light-card dark:from-dark-bg dark:via-gray-900 dark:to-card-bg font-body transition-colors duration-300">
      <Header onLoginClick={onLoginClick} />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 