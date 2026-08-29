import React from 'react';
import { ShieldCheck, Clock, XCircle } from 'lucide-react';

export const VerificationBadge = ({ status = 'VERIFIED', label, size = 'md' }) => {
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  if (status === 'VERIFIED') {
    return (
      <span className="badge badge-verified" title="Background checked and trade certified by TrustFix">
        <ShieldCheck size={iconSize} strokeWidth={2.2} aria-hidden="true" />
        <span>{label || 'Verified'}</span>
      </span>
    );
  }

  if (status === 'PENDING') {
    return (
      <span className="badge badge-pending" title="Verification documents under review">
        <Clock size={iconSize} strokeWidth={2} aria-hidden="true" />
        <span>{label || 'Pending Verification'}</span>
      </span>
    );
  }

  if (status === 'REJECTED') {
    return (
      <span className="badge badge-rejected" title="Verification requirements not met">
        <XCircle size={iconSize} strokeWidth={2} aria-hidden="true" />
        <span>{label || 'Verification Rejected'}</span>
      </span>
    );
  }

  return null;
};
