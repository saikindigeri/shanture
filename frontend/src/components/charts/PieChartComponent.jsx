import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];

const PieChartComponent = ({ data, labelKey, valueKey, tooltipFormatter }) => {
  console.log('PieChartComponent data:', JSON.stringify(data, null, 2));
  console.log('PieChartComponent props:', { labelKey, valueKey, tooltipFormatter });

  // Validate data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No valid data for PieChart');
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 sm:p-6 text-gray-100 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Revenue by Category</h3>
        <p className="text-gray-400 text-sm">No data available for the selected date range</p>
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
      console.warn(`Invalid entry at index ${index} for PieChart:`, entry);
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
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 sm:p-6 text-gray-100 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Revenue by Category</h3>
        <p className="text-gray-400 text-sm">Invalid data format</p>
      </div>
    );
  }

  // Responsive label formatting
  const formatLabel = (entry, isMobile = window.innerWidth < 640) =>
    isMobile ? `${(entry.percent * 100).toFixed(0)}%` : `${entry.name} (${(entry.percent * 100).toFixed(1)}%)`;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 sm:p-6 shadow-lg transform hover:scale-[1.01] sm:hover:scale-[1.02] transition-transform duration-300">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-100">Revenue by Category</h3>
      <div className="w-full h-[200px] sm:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              dataKey={valueKey}
              nameKey={labelKey}
              cx="50%"
              cy="50%"
              outerRadius={window.innerWidth < 640 ? 60 : 100}
              label={formatLabel}
              labelLine={{ stroke: '#d1d5db' }}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={tooltipFormatter || ((value) => `$${Number(value).toFixed(2)}`)}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                color: '#d1d5db',
                fontSize: window.innerWidth < 640 ? 10 : 12,
              }}
              cursor={{ fill: '#374151' }}
            />
            <Legend wrapperStyle={{ color: '#d1d5db', fontSize: window.innerWidth < 640 ? 10 : 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartComponent;