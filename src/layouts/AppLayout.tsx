import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/layout/MainContent';

const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="app">
      <Navbar />
      <div className="app__main">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
};

export default AppLayout;
