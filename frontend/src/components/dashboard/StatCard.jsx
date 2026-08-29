import React from 'react';

export const StatCard = ({ title, value, subtitle, icon, trend, color = 'primary' }) => {
  const getIconBg = () => {
    switch (color) {
      case 'success':
        return { bg: 'var(--success-50)', color: 'var(--success-700)', border: '1px solid var(--success-100)' };
      case 'warning':
        return { bg: 'var(--warning-50)', color: 'var(--warning-700)', border: '1px solid var(--warning-100)' };
      case 'danger':
        return { bg: 'var(--danger-50)', color: 'var(--danger-700)', border: '1px solid var(--danger-100)' };
      case 'info':
        return { bg: 'var(--info-50)', color: 'var(--info-700)', border: '1px solid var(--info-100)' };
      case 'primary':
      default:
        return { bg: 'var(--primary-100)', color: 'var(--primary-800)', border: '1px solid var(--primary-200)' };
    }
  };

  const iconStyle = getIconBg();

  return (
    <div className="card card-hoverable" style={{ border: '1px solid var(--neutral-200)' }}>
      <div className="card-body">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: iconStyle.bg,
                color: iconStyle.color,
                border: iconStyle.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--neutral-900)', margin: 0, letterSpacing: '-0.02em' }}>
            {value}
          </h3>
          {trend && (
            <span className="text-xs font-bold" style={{ color: 'var(--success-600)' }}>
              {trend}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-muted" style={{ margin: 0, marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
