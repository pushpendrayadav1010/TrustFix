import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { adminService } from '../../services/adminService';
import { VerificationBadge } from '../../components/common/VerificationBadge';

export const AdminProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllProviderProfiles();
      setProviders(data);
    } catch (err) {
      console.error('Failed to load providers:', err);
      setError('Unable to fetch provider profiles from backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (providerId, newStatus) => {
    if (!providerId) {
      alert('This provider has not set up a profile record yet.');
      return;
    }
    try {
      setProcessingId(providerId);
      setActionSuccess(null);
      const updated = await adminService.verifyProvider(providerId, newStatus);
      setActionSuccess(`Provider ID #${updated.id} (${updated.businessName}) status updated to ${updated.verificationStatus}.`);
      fetchProviders();
    } catch (err) {
      alert('Verification update failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const filteredProviders = providers.filter((p) => {
    if (statusFilter === 'ALL') return true;
    return p.verificationStatus === statusFilter;
  });

  return (
    <div className="admin-providers-page">
      <DashboardHeader
        title="Provider Verification & Directory"
        subtitle="Audit background checks, trade credentials, and manage provider verification status."
      />

      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '1200px' }}>
          {actionSuccess && (
            <div className="alert alert-success mb-4" role="alert">
              ✓ {actionSuccess}
            </div>
          )}

          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              ⚠️ {error}
            </div>
          )}

          {/* Filter Bar */}
          <div className="card p-3 mb-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Status Filter:</span>
              <button
                className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('ALL')}
              >
                All Statuses
              </button>
              <button
                className={`btn btn-sm ${statusFilter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('PENDING')}
              >
                Pending Verification
              </button>
              <button
                className={`btn btn-sm ${statusFilter === 'VERIFIED' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('VERIFIED')}
              >
                Verified
              </button>
              <button
                className={`btn btn-sm ${statusFilter === 'REJECTED' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('REJECTED')}
              >
                Rejected
              </button>
            </div>

            <button className="btn btn-sm btn-outline-primary" onClick={fetchProviders}>
              🔄 Refresh List
            </button>
          </div>

          {/* Providers Table */}
          <div className="card p-0 overflow-hidden">
            {loading ? (
              <div className="p-5 text-center">
                <div className="spinner-border text-primary mb-2" role="status" />
                <p className="text-muted">Loading providers from backend...</p>
              </div>
            ) : filteredProviders.length === 0 ? (
              <div className="p-5 text-center text-muted">No provider profiles match selected filter.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: 'var(--neutral-100)', borderBottom: '1px solid var(--neutral-200)' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem' }}>Prof ID</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Business / Owner</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Contact</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Location</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Experience</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Verification</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProviders.map((p) => (
                      <tr key={p.id || `user-${p.userId}`} style={{ borderBottom: '1px solid var(--neutral-200)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                          {p.id ? `#${p.id}` : <span className="text-xs text-muted">No Record</span>}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div className="font-bold text-neutral-900">{p.businessName}</div>
                          <div className="text-xs text-muted">Owner: {p.userName}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div className="text-sm">{p.userEmail}</div>
                          <div className="text-xs text-muted">{p.userPhone || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                          {p.city}, {p.state} {p.postalCode ? `(${p.postalCode})` : ''}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                          {p.experienceYears ? `${p.experienceYears} Years` : 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <VerificationBadge status={p.verificationStatus} />
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-2">
                            {p.id ? (
                              <>
                                {p.verificationStatus !== 'VERIFIED' && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    disabled={processingId === p.id}
                                    onClick={() => handleVerify(p.id, 'VERIFIED')}
                                  >
                                    ✓ Verify
                                  </button>
                                )}

                                {p.verificationStatus !== 'REJECTED' && (
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    disabled={processingId === p.id}
                                    onClick={() => handleVerify(p.id, 'REJECTED')}
                                  >
                                    ✕ Reject
                                  </button>
                                )}
                              </>
                            ) : (
                              <span className="text-xs text-muted">Setup Pending</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
