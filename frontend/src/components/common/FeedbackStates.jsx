import React from 'react';
import { Inbox, AlertCircle, Search, RotateCcw } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => (
  <div className="flex flex-col items-center justify-center gap-3" style={{ padding: '3rem 1rem' }}>
    <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} />
    {message && <p className="text-sm text-muted">{message}</p>}
  </div>
);

export const EmptyState = ({
  icon: IconComponent = Inbox,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  action,
}) => (
  <div className="empty-state">
    <div className="empty-state-icon">
      {typeof IconComponent === 'function' || typeof IconComponent === 'object' ? (
        <IconComponent size={28} strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Inbox size={28} strokeWidth={1.75} aria-hidden="true" />
      )}
    </div>
    <h4>{title}</h4>
    <p>{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ErrorMessage = ({ message = 'Something went wrong. Please try again.', onRetry }) => (
  <div className="alert alert-danger">
    <AlertCircle size={20} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
    <div className="flex-1">
      <p style={{ color: 'inherit', fontWeight: 500 }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-sm btn-secondary"
          style={{ marginTop: '0.5rem' }}
        >
          <RotateCcw size={13} strokeWidth={2} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  </div>
);

export const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search services, electricians, plumbers, AC repair...',
  className = '',
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`search-box ${className}`}>
      <span className="search-icon">
        <Search size={18} strokeWidth={2} aria-hidden="true" />
      </span>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </form>
  );
};
