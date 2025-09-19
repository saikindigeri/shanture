import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarChartComponent = ({ data, xKey, yKey, label }) => {
  console.log('BarChartComponent data:', data);
  console.log('BarChartComponent props:', { xKey, yKey, label });

  // Validate data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No valid data for BarChart:', label);
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-gray-100 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{label}</h3>
        <p className="text-gray-400">No data available</p>
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

  // Truncate long names for x-axis labels
  const formatTick = (name) => (name.length > 12 ? `${name.substring(0, 12)}...` : name);

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">{label}</h3>
      <div className="w-full h-[350px]">
        <BarChart
          width={600}
          height={300}
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis
            dataKey={xKey}
            tickFormatter={formatTick}
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fill: '#d1d5db', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#d1d5db', fontSize: 12 }} />
          <Tooltip
            formatter={(value) => Number(value).toFixed(2)}
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#d1d5db' }}
            cursor={{ fill: '#374151' }}
          />
          <Legend wrapperStyle={{ color: '#d1d5db' }} />
          <Bar dataKey={yKey} fill="#3b82f6" />
        </BarChart>
      </div>
    </div>
  );
};

export default BarChartComponent;