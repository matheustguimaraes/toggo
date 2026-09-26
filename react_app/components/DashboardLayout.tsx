import React, { ReactNode, useState } from 'react';
import ThemeToggleButton from './ThemeToggleButton';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentUser, setCurrentUser] = useState({
    name: 'Teste da Silva',
    profilePicUrl: '/imgs/profile_pic.png'
  });

  return (
    <>
      <div className="feed-page-container">
        <aside className="sidebar">
          <div className="logo"></div>
          
          <div className="profile-section">
            <img 
              src={currentUser.profilePicUrl} 
              alt="Foto de Perfil" 
              className="profile-pic" 
            />
            <div className="profile-info">
              <span>{currentUser.name}</span>
              <a href="#">Ver perfil</a>
            </div>
          </div>
          
          <nav className="menu-nav"></nav>
        </aside>

        <main className="main-content">{children}</main>
      </div>
      <ThemeToggleButton />
    </>
  );
}