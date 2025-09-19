import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data, xKey, yKey, label, tooltipFormatter }) => {
  console.log('BarChartComponent data:', JSON.stringify(data, null, 2));
  console.log('BarChartComponent props:', { xKey, yKey, label, tooltipFormatter });

  // Validate data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No valid data for BarChart:', label);
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 sm:p-6 text-gray-100 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{label}</h3>
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  // Format data to ensure numbers and valid names
  const formattedData = data.map((entry, index) => {
    const formattedEntry = {
      [xKey]: entry[xKey] || `Unknown ${index + 1}`,
      [yKey]: Number(entry[yKey]) || 0,
    };
    if (!entry[xKey] || isNaN(Number(entry[yKey]))) {
      console.warn(`Invalid entry at index ${index} for ${label}:`, entry);
    }
    return formattedEntry;
  });

  // Truncate long names for x-axis labels, responsive to screen size
  const formatTick = (name, isMobile = window.innerWidth < 640) =>
    name.length > (isMobile ? 8 : 12) ? `${name.substring(0, isMobile ? 8 : 12)}...` : name;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 sm:p-6 shadow-lg transform hover:scale-[1.01] sm:hover:scale-[1.02] transition-transform duration-300">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-100">{label}</h3>
      <div className="w-full h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: 0, bottom: window.innerWidth < 640 ? 40 : 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis
              dataKey={xKey}
              tickFormatter={formatTick}
              angle={-45}
              textAnchor="end"
              interval={0}
              tick={{ fill: '#d1d5db', fontSize: window.innerWidth < 640 ? 10 : 12 }}
            />
            <YAxis tick={{ fill: '#d1d5db', fontSize: window.innerWidth < 640 ? 10 : 12 }} />
            <Tooltip
              formatter={tooltipFormatter || ((value) => Number(value).toFixed(2))}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#d1d5db', fontSize: window.innerWidth < 640 ? 10 : 12 }}
              cursor={{ fill: '#374151' }}
            />
            <Legend wrapperStyle={{ color: '#d1d5db', fontSize: window.innerWidth < 640 ? 10 : 12 }} />
            <Bar dataKey={yKey} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;