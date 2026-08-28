import React from 'react';

export const VerificationBadge = ({ status = 'VERIFIED', label, size = 'md' }) => {
  if (status === 'VERIFIED') {
    return (
      <span className="badge badge-verified" title="Background checked and skill verified by TrustFix">
        <span>✓</span>
        <span>{label || 'Verified'}</span>
      </span>
    );
  }

  if (status === 'PENDING') {
    return (
      <span className="badge badge-pending" title="Verification documents under review">
        <span>⏳</span>
        <span>{label || 'Pending Verification'}</span>
      </span>
    );
  }

  if (status === 'REJECTED') {
    return (
      <span className="badge badge-rejected" title="Verification requirements not met">
        <span>✕</span>
        <span>{label || 'Verification Rejected'}</span>
      </span>
    );
  }

  return null;
};
