import React from 'react';
import './Loading.css';

const Loading = ({ size = 'medium', fullScreen = false }) => {
  const sizeClass = `loading-${size}`;
  const containerClass = fullScreen ? 'loading-fullscreen' : 'loading-container';

  return (
    <div className={containerClass}>
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner"></div>
      </div>
      {fullScreen && <p className="loading-text">Loading...</p>}
    </div>
  );
};

export default Loading;

