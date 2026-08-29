import React from 'react';
import { formatStatus } from '../../utils/formatters';
import { CheckCircle2, Clock3, PlayCircle, XCircle, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  let badgeClass = 'badge-pending';
  let Icon = Clock3;

  switch (status) {
    case 'CONFIRMED':
      badgeClass = 'badge-confirmed';
      Icon = CheckCircle2;
      break;
    case 'IN_PROGRESS':
      badgeClass = 'badge-in-progress';
      Icon = PlayCircle;
      break;
    case 'COMPLETED':
      badgeClass = 'badge-completed';
      Icon = CheckCircle2;
      break;
    case 'CANCELLED':
      badgeClass = 'badge-cancelled';
      Icon = XCircle;
      break;
    case 'REJECTED':
      badgeClass = 'badge-rejected';
      Icon = AlertCircle;
      break;
    case 'PENDING':
    default:
      badgeClass = 'badge-pending';
      Icon = Clock3;
      break;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={12} strokeWidth={2} aria-hidden="true" />
      <span>{formatStatus(status)}</span>
    </span>
  );
};
