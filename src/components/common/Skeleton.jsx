import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, className = '', variant = 'rectangular' }) => {
  const style = {
    width: width || '100%',
    height: height || '1rem',
  };

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={style}
      aria-label="Loading..."
    />
  );
};

export const SkeletonTable = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="skeleton-table-container">
      <div className="skeleton-table">
        {/* Header */}
        <div className="skeleton-table-header">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`header-${i}`} height="40px" className="skeleton-header-cell" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="skeleton-table-row">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="60px" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;

