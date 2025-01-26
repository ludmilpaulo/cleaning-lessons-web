import React from 'react';

interface ProgressProps {
  value: number; // Progress percentage
  className?: string; // Additional styling
  ariaLabel?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, className = '', ariaLabel }) => (
  <div className={`relative h-4 bg-gray-200 rounded ${className}`}>
    <div
      className="absolute top-0 left-0 h-full bg-blue-500 rounded"
      style={{ width: `${value}%` }}
      aria-label={ariaLabel || `${value}% complete`}
    />
  </div>
);

export default Progress;
