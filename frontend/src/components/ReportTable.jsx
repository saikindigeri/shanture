import React from 'react';

const ReportTable = ({ reports }) => {
  // Validate reports prop
  if (!reports || !Array.isArray(reports) || reports.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-gray-100">
        <p>No reports available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg shadow-lg text-gray-100">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Report Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Start Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">End Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Total Orders</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Total Revenue</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Avg Order Value</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr
              key={report.id}
              className="border-t border-gray-700 hover:bg-gray-600 transition-colors duration-200"
            >
              <td className="px-4 py-3 text-sm">
                {new Date(report.report_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td className="px-4 py-3 text-sm">{report.start_date.split('T')[0]}</td>
              <td className="px-4 py-3 text-sm">{report.end_date.split('T')[0]}</td>
              <td className="px-4 py-3 text-sm">{report.total_orders || 0}</td>
              <td className="px-4 py-3 text-sm">
                ${Number(report.total_revenue || 0).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-sm">
                ${Number(report.avg_order_value || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;