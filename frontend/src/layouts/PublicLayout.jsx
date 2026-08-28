import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/navbar/PublicNavbar';
import { PublicFooter } from '../components/footer/PublicFooter';
import { DemoSwitcher } from '../components/common/DemoSwitcher';

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <DemoSwitcher />
    </div>
  );
};
