import React from 'react';
import { formatStatus } from '../../utils/formatters';

export const StatusBadge = ({ status }) => {
  let badgeClass = 'badge-pending';

  switch (status) {
    case 'CONFIRMED':
      badgeClass = 'badge-confirmed';
      break;
    case 'IN_PROGRESS':
      badgeClass = 'badge-in-progress';
      break;
    case 'COMPLETED':
      badgeClass = 'badge-completed';
      break;
    case 'CANCELLED':
      badgeClass = 'badge-cancelled';
      break;
    case 'PENDING':
    default:
      badgeClass = 'badge-pending';
      break;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {formatStatus(status)}
    </span>
  );
};
