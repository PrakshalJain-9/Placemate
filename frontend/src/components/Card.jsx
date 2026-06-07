import React from 'react';

export default function Card({ children, className = '', style, onClick, ...props }) {
  return (
    <div
      className={`card ${className}`}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
