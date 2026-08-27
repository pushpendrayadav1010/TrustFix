import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';

export const AdminDashboardPlaceholder = () => {
  return (
    <div className="admin-dashboard-placeholder">
      <DashboardHeader
        title="Admin Control Center (Future Phase)"
        subtitle="Platform governance, provider background verification queue, category management, and audit logs."
      />

      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '780px' }}>
          
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛡️</div>
            
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)', marginBottom: '0.75rem' }}>
              Admin Verification & Management Architecture Ready
            </h2>

            <p style={{ color: 'var(--neutral-600)', maxWidth: '560px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
              The TrustFix frontend routing and authorization guards are structured to seamlessly connect with future Spring Boot Admin endpoints for:
            </p>

            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', textAlign: 'left', marginBottom: '2.5rem' }}>
              <div className="p-3 bg-neutral-50 rounded border" style={{ backgroundColor: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <h5 style={{ fontWeight: 700, margin: 0 }}>✓ Provider Verification</h5>
                <p className="text-xs text-muted mt-1">Audit Aadhaar, trade licenses, and toggle verification status between PENDING, VERIFIED, and REJECTED.</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded border" style={{ backgroundColor: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <h5 style={{ fontWeight: 700, margin: 0 }}>🗂️ Category & Services</h5>
                <p className="text-xs text-muted mt-1">Manage global service catalog taxonomy, base rates, and diagnostic checklists.</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded border" style={{ backgroundColor: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <h5 style={{ fontWeight: 700, margin: 0 }}>👥 User Administration</h5>
                <p className="text-xs text-muted mt-1">Monitor dispute resolutions, customer booking logs, and fraud prevention flags.</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Link to="/customer/dashboard" className="btn btn-primary">
                Preview Customer Portal
              </Link>
              <Link to="/provider/dashboard" className="btn btn-secondary">
                Preview Provider Portal
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
