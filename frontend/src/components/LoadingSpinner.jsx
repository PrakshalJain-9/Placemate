import React from 'react';

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      {message && <div className="mt-4 text-muted font-medium">{message}</div>}
    </div>
  );
}
