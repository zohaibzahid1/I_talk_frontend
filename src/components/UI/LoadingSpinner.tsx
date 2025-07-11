import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = 'md',
  fullScreen = true 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12 sm:h-16 sm:w-16',
    lg: 'h-20 w-20 sm:h-24 sm:w-24'
  };

  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-gray-50 px-4"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-sm sm:text-base text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
