import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { ShieldCheck, CheckCircle2, FolderTree, Users } from 'lucide-react';

export const AdminDashboardPlaceholder = () => {
  return (
    <div className="admin-dashboard-placeholder">
      <DashboardHeader
        title="Admin Control Center"
        subtitle="Platform governance, provider background verification queue, category management, and audit logs."
      />

      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '780px' }}>
          
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <ShieldCheck size={32} strokeWidth={2.2} />
            </div>
            
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)', marginBottom: '0.75rem' }}>
              Admin Governance Architecture
            </h2>

            <p style={{ color: 'var(--neutral-600)', maxWidth: '560px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
              The TrustFix frontend routing and authorization guards are structured to seamlessly manage all platform operations:
            </p>

            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', textAlign: 'left', marginBottom: '2.5rem' }}>
              <div className="p-3 bg-neutral-50 rounded border" style={{ backgroundColor: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <h5 style={{ fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--primary-700)" />
                  <span>Provider Verification</span>
                </h5>
                <p className="text-xs text-muted mt-1">Audit Aadhaar, trade licenses, and toggle verification status between PENDING, VERIFIED, and REJECTED.</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded border" style={{ backgroundColor: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <h5 style={{ fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FolderTree size={16} color="var(--primary-700)" />
                  <span>Category & Services</span>
                </h5>
                <p className="text-xs text-muted mt-1">Manage global service catalog taxonomy, base rates, and diagnostic checklists.</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded border" style={{ backgroundColor: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <h5 style={{ fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} color="var(--primary-700)" />
                  <span>User Administration</span>
                </h5>
                <p className="text-xs text-muted mt-1">Monitor dispute resolutions, customer booking logs, and fraud prevention flags.</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Link to="/customer/dashboard" className="btn btn-primary">
                Customer Portal
              </Link>
              <Link to="/provider/dashboard" className="btn btn-secondary">
                Provider Portal
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
