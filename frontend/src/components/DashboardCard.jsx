import React from 'react';

const DashboardCard = ({ title, value, className }) => {
  
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div
      className={`p-6 bg-gray-800 rounded-lg shadow-lg border-l-4 border-blue-500 hover:bg-gray-700 transform hover:scale-[1.02] transition-all duration-300 ${className}`}
    >
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-2xl font-bold text-gray-100 mt-2">{formattedValue}</p>
    </div>
  );
};

export default DashboardCard;