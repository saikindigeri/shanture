import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];

const PieChartComponent = ({ data, labelKey, valueKey }) => {
  console.log('PieChartComponent data:', data);
  console.log('PieChartComponent props:', { labelKey, valueKey });

  // Ensure data is an array and not empty
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No valid data for PieChart');
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-gray-100 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
        <p className="text-gray-400">No data available for the selected date range</p>
      </div>
    );
  }

  // Format and validate data
  const formattedData = data.map((entry, index) => {
    const formattedEntry = {
      [labelKey]: entry[labelKey] || `Unknown ${index + 1}`,
      [valueKey]: Number(entry[valueKey]) || 0,
    };
    if (!entry[labelKey] || isNaN(Number(entry[valueKey]))) {
      console.warn(`Invalid entry at index ${index}:`, entry);
    }
    return formattedEntry;
  });

  // Check if all entries are valid
  const isValidData = formattedData.every(
    (entry) => entry[labelKey] && typeof entry[valueKey] === 'number' && !isNaN(entry[valueKey])
  );
  if (!isValidData) {
    console.warn('Invalid data format for PieChart after formatting:', formattedData);
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-gray-100 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
        <p className="text-gray-400">Invalid data format</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">Revenue by Category</h3>
      <div className="w-full h-[350px]">
        <PieChart width={400} height={300}>
          <Pie
            data={formattedData}
            dataKey={valueKey}
            nameKey={labelKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#3b82f6"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `$${Number(value).toFixed(2)}`}
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#d1d5db' }}
            cursor={{ fill: '#374151' }}
          />
          <Legend wrapperStyle={{ color: '#d1d5db', fontSize: 12 }} />
        </PieChart>
      </div>
    </div>
  );
};

export default PieChartComponent;