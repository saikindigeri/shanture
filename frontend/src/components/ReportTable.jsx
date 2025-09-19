import React from 'react';

const ReportTable = ({ reports }) => {
  // Validate reports prop
  if (!reports || !Array.isArray(reports) || reports.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 text-gray-100 text-center text-sm sm:text-base">
        <p>No reports available</p>
      </div>
    );
  }

  // Format date safely
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'Unknown') return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[600px] w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg text-gray-100">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">Report Date</th>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider hidden sm:table-cell">Start Date</th>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider hidden sm:table-cell">End Date</th>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">Total Orders</th>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">Total Revenue</th>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider hidden md:table-cell">Avg Order Value</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr
              key={report.id || Math.random()} // Fallback key for edge cases
              className="border-t border-gray-700 hover:bg-gray-600 transition-colors duration-200"
            >
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{formatDate(report.report_date)}</td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">{report.start_date?.split('T')[0] || 'N/A'}</td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">{report.end_date?.split('T')[0] || 'N/A'}</td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{Number(report.total_orders || 0).toLocaleString()}</td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">${Number(report.total_revenue || 0).toFixed(2)}</td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">${Number(report.avg_order_value || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;