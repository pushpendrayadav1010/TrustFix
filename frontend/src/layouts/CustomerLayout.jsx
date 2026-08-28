import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DemoSwitcher } from '../components/common/DemoSwitcher';

export const CustomerLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar role="CUSTOMER" />
      <div className="dashboard-main">
        <Outlet />
      </div>
      <DemoSwitcher />
    </div>
  );
};
