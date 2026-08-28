import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // primary | secondary | success | danger | light
  size = 'md',        // sm | md | lg
  block = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon,
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const blockClass = block ? 'btn-block' : '';
  const variantClass = `btn-${variant}`;

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${blockClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner spinner-sm" aria-hidden="true" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
