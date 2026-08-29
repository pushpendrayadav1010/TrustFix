import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';

export const CustomerLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar role="CUSTOMER" />
      <div className="dashboard-main">
        <Outlet />
      </div>
    </div>
  );
};
