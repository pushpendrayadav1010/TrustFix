import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DemoSwitcher } from '../components/common/DemoSwitcher';

export const ProviderLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar role="PROVIDER" />
      <div className="dashboard-main">
        <Outlet />
      </div>
      <DemoSwitcher />
    </div>
  );
};
