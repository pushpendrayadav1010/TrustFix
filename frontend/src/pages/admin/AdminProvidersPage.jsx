import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Eye, Search } from 'lucide-react';

export const AdminProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Verification Modal State
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [modalType, setModalType] = useState('VERIFY'); // 'VERIFY' | 'REJECT'
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllProviderProfiles();
      setProviders(data);
    } catch (err) {
      console.error('Failed to load provider profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleActionClick = (prov, type) => {
    setSelectedProvider(prov);
    setModalType(type);
    setModalOpen(true);
  };

  const handleConfirmVerification = async () => {
    if (!selectedProvider?.id) {
      alert('Provider profile ID not initialized yet.');
      setModalOpen(false);
      return;
    }
    setActionLoading(true);
    try {
      const statusToSet = modalType === 'VERIFY' ? 'VERIFIED' : 'REJECTED';
      await adminService.verifyProvider(selectedProvider.id, statusToSet);
      setModalOpen(false);
      await fetchProviders();
    } catch (err) {
      alert(err.message || 'Failed to update verification status');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProviders = providers.filter((p) => {
    const matchesStatus = filterStatus === 'ALL' || p.verificationStatus === filterStatus;
    const name = (p.businessName || p.userName || '').toLowerCase();
    const email = (p.userEmail || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || name.includes(q) || email.includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <DashboardHeader
        title="Provider Verification & Approvals"
        subtitle="Review specialist documentation, background checks, and verification state."
      />

      <div className="dashboard-content">
        
        {/* Controls Card */}
        <div className="card mb-6" style={{ padding: '1rem', backgroundColor: 'var(--white)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => setFilterStatus(st)}
                >
                  <span>{st}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '32px', fontSize: '13px' }}
                placeholder="Search provider or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* Providers Table */}
        {loading ? (
          <LoadingSpinner message="Loading provider records..." />
        ) : filteredProviders.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No providers found"
            description="Try changing the filter or search query."
          />
        ) : (
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Provider / Brand</th>
                    <th>Contact Info</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Availability</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProviders.map((p, idx) => (
                    <tr key={p.id || idx}>
                      <td>
                        <strong className="text-sm block" style={{ color: 'var(--neutral-900)' }}>
                          {p.businessName || p.userName}
                        </strong>
                        <span className="text-2xs text-muted font-semibold">{p.service || 'Service Professional'}</span>
                      </td>
                      <td>
                        <span className="text-xs block">{p.userEmail || 'N/A'}</span>
                        <span className="text-2xs text-muted">{p.userPhone || 'No Phone'}</span>
                      </td>
                      <td>
                        <span className="text-xs">{p.city || 'Mumbai'}, {p.state || 'Maharashtra'}</span>
                      </td>
                      <td>
                        <VerificationBadge status={p.verificationStatus || 'PENDING'} />
                      </td>
                      <td>
                        <span className={`status-dot ${p.available ? 'online' : 'offline'}`} />
                        <span className="text-xs font-semibold ml-1">{p.available ? 'Online' : 'Offline'}</span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.verificationStatus !== 'VERIFIED' && p.id && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              onClick={() => handleActionClick(p, 'VERIFY')}
                              title="Approve Verification"
                            >
                              <CheckCircle2 size={13} />
                              <span>Verify</span>
                            </button>
                          )}

                          {p.verificationStatus !== 'REJECTED' && p.id && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              onClick={() => handleActionClick(p, 'REJECT')}
                              title="Reject Application"
                            >
                              <XCircle size={13} />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Verification Confirmation Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalType === 'VERIFY' ? 'Approve Provider Verification' : 'Reject Provider Application'}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={modalType === 'VERIFY' ? 'success' : 'danger'}
                loading={actionLoading}
                onClick={handleConfirmVerification}
              >
                {modalType === 'VERIFY' ? 'Confirm Approval' : 'Confirm Rejection'}
              </Button>
            </>
          }
        >
          <div>
            <p className="text-xs text-muted mb-3">
              Are you sure you want to <strong>{modalType === 'VERIFY' ? 'approve and verify' : 'reject'}</strong> the credentials for <strong>{selectedProvider?.businessName || selectedProvider?.userName}</strong>?
            </p>
            {modalType === 'VERIFY' ? (
              <div className="alert alert-success">
                <CheckCircle2 size={16} />
                <span>This provider will receive the Verified Specialist Badge and be eligible for live bookings.</span>
              </div>
            ) : (
              <div className="alert alert-danger">
                <AlertCircle size={16} />
                <span>The provider profile will be set to REJECTED and removed from public listings.</span>
              </div>
            )}
          </div>
        </Modal>

      </div>
    </div>
  );
};
