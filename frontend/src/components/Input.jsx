import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <input className="input-field" {...props} />
      {error && <div className="text-error text-sm mt-1">{error}</div>}
    </div>
  );
}
