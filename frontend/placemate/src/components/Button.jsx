import React from 'react';

export default function Button({ children, variant = 'primary', size = '', className = '', disabled, ...props }) {
  const variantClass =
    variant === 'secondary' ? 'btn-secondary' :
    variant === 'danger'    ? 'btn-danger'    :
    variant === 'success'   ? 'btn-success'   :
    'btn-primary';
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'xs' ? 'btn-xs' : '';
  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
