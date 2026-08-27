import React from 'react';

export const StatCard = ({ title, value, subtitle, icon, trend, color = 'primary' }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: color === 'success' ? 'var(--success-50)' : 'var(--primary-50)',
                color: color === 'success' ? 'var(--success-600)' : 'var(--primary-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)' }}>
            {value}
          </h3>
          {trend && (
            <span className="text-xs font-semibold" style={{ color: 'var(--success-600)' }}>
              {trend}
            </span>
          )}
        </div>

        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
    </div>
  );
};
