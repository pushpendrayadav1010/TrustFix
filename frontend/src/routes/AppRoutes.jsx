import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { ProviderLayout } from '../layouts/ProviderLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { ServicesPage } from '../pages/public/ServicesPage';
import { ServiceDetailsPage } from '../pages/public/ServiceDetailsPage';
import { BrowseProvidersPage } from '../pages/public/BrowseProvidersPage';
import { PublicProviderProfilePage } from '../pages/public/PublicProviderProfilePage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { BookServicePage } from '../pages/customer/BookServicePage';
import { MyBookingsPage } from '../pages/customer/MyBookingsPage';
import { BookingDetailsPage } from '../pages/customer/BookingDetailsPage';
import { CustomerAddressesPage } from '../pages/customer/CustomerAddressesPage';
import { CustomerProfilePage } from '../pages/customer/CustomerProfilePage';

// Provider Pages
import { ProviderDashboard } from '../pages/provider/ProviderDashboard';
import { ProviderProfilePage } from '../pages/provider/ProviderProfilePage';
import { MyServicesPage } from '../pages/provider/MyServicesPage';
import { ManagePricingPage } from '../pages/provider/ManagePricingPage';
import { BookingRequestsPage } from '../pages/provider/BookingRequestsPage';
import { ProviderBookingDetailsPage } from '../pages/provider/ProviderBookingDetailsPage';
import { ProviderReviewsPage } from '../pages/provider/ProviderReviewsPage';
import { AvailabilityPage } from '../pages/provider/AvailabilityPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminProvidersPage } from '../pages/admin/AdminProvidersPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminServicesPage } from '../pages/admin/AdminServicesPage';
import { AdminBookingsPage } from '../pages/admin/AdminBookingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:categorySlug" element={<ServicesPage />} />
        <Route path="/services/detail/:serviceId" element={<ServiceDetailsPage />} />
        <Route path="/browse" element={<BrowseProvidersPage />} />
        <Route path="/providers" element={<BrowseProvidersPage />} />
        <Route path="/providers/:providerId" element={<PublicProviderProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>

      {/* Customer Portal Protected Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="browse" element={<BrowseProvidersPage />} />
        <Route path="book" element={<BookServicePage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="bookings/:bookingId" element={<BookingDetailsPage />} />
        <Route path="addresses" element={<CustomerAddressesPage />} />
        <Route path="profile" element={<CustomerProfilePage />} />
      </Route>

      {/* Provider Portal Protected Routes */}
      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRoles={['PROVIDER']}>
            <ProviderLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/provider/dashboard" replace />} />
        <Route path="dashboard" element={<ProviderDashboard />} />
        <Route path="profile" element={<ProviderProfilePage />} />
        <Route path="services" element={<MyServicesPage />} />
        <Route path="pricing" element={<ManagePricingPage />} />
        <Route path="requests" element={<BookingRequestsPage />} />
        <Route path="bookings/:bookingId" element={<ProviderBookingDetailsPage />} />
        <Route path="reviews" element={<ProviderReviewsPage />} />
        <Route path="availability" element={<AvailabilityPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="providers" element={<AdminProvidersPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
