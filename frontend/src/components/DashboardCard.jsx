import React from 'react';

const DashboardCard = ({ title, value, className }) => {
  // Format value: handle numbers, strings, and edge cases
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    : typeof value === 'string' && value.startsWith('$') 
    ? value 
    : value || 'N/A';

  return (
    <div
      className={`
        p-4 sm:p-6 
        bg-gradient-to-br from-gray-800 to-gray-900 
        rounded-lg shadow-lg 
        border-l-4 border-blue-500 
        hover:bg-gray-700 
        transform hover:scale-[1.01] sm:hover:scale-[1.02] 
        transition-all duration-300 
        ${className}
      `}
    >
      <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
      <p className="text-xl sm:text-2xl font-bold text-gray-100 mt-1 sm:mt-2">{formattedValue}</p>
    </div>
  );
};

export default DashboardCard;