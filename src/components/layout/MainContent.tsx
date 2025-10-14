import React from 'react';

const MainContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <main className="card">{children}</main>;
};

export default MainContent;
