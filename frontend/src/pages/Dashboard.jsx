import React, { useState, useEffect } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import DashboardCard from '../components/DashboardCard';
import ReportTable from '../components/ReportTable';
import BarChartComponent from '../components/charts/BarChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import Papa from 'papaparse';
import axios from 'axios';

const Dashboard = () => {
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://dashboard-fbbx.onrender.com/api/analytics/reports');
      console.log('Raw API response:', JSON.stringify(response.data, null, 2));
      const formattedReports = response.data.map(report => ({
        id: Number(report.id) || 0,
        report_date: report.report_date || 'Unknown',
        start_date: report.start_date || 'Unknown',
        end_date: report.end_date || 'Unknown',
        total_orders: Number(report.total_orders) || 0,
        total_revenue: Number(report.total_revenue) || 0,
        avg_order_value: Number(report.avg_order_value) || 0,
        created_at: report.created_at || 'Unknown',
      }));
      console.log('Formatted reports:', JSON.stringify(formattedReports, null, 2));
      setReports(formattedReports);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Fetch reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Generating report for:', startDate, endDate);
      const response = await axios.get('https://dashboard-fbbx.onrender.com/api/analytics/generate', {
        params: { startDate, endDate },
      });
      console.log('API response:', JSON.stringify(response.data, null, 2));
      const formattedReport = {
        id: Number(response.data.id) || 0,
        report_date: response.data.report_date || 'Unknown',
        start_date: response.data.start_date || 'Unknown',
        end_date: response.data.end_date || 'Unknown',
        total_orders: Number(response.data.total_orders) || 0,
        total_revenue: Number(response.data.total_revenue) || 0,
        avg_order_value: Number(response.data.avg_order_value) || 0,
        top_products: (response.data.top_products || []).map(p => ({
          product_id: p.product_id || 'Unknown',
          name: p.name || 'Unknown Product',
          total_sold: Number(p.total_sold) || 0,
        })),
        top_customers: (response.data.top_customers || []).map(c => ({
          customer_id: c.customer_id || 'Unknown',
          name: c.name || 'Unknown Customer',
          total_spent: Number(c.total_spent) || 0,
        })),
        region_wise_stats: (response.data.region_wise_stats || []).map(r => ({
          region: r.region || 'Unknown',
          total_revenue: Number(r.total_revenue) || 0,
          total_orders: Number(r.total_orders) || 0,
        })),
        category_wise_stats: (response.data.category_wise_stats || []).map(c => ({
          category: c.category || 'Unknown',
          total_revenue: Number(c.total_revenue) || 0,
          total_orders: Number(c.total_orders) || 0,
        })),
        created_at: response.data.created_at || 'Unknown',
      };
      console.log('Formatted report:', JSON.stringify(formattedReport, null, 2));
      setReport(formattedReport);
      await fetchReports();
    } catch (err) {
      setError('Failed to generate report');
      console.error('Generate report error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const today = new Date().toISOString().split('T')[0]; // e.g., '2025-09-19'
    const csvData = reports.map(r => ({
      report_date: new Date(r.report_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      start_date: r.start_date,
      end_date: r.end_date,
      total_orders: Number(r.total_orders) || 0,
      total_revenue: Number(r.total_revenue) || 0,
      avg_order_value: Number(r.avg_order_value) || 0,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_report_${today}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8 lg:p-10 font-inter antialiased">
      <div className="container mx-auto max-w-full sm:max-w-4xl lg:max-w-7xl">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 md:mb-10 tracking-tight text-white">
          Sales Analytics 
        </h1>

        {/* Controls */}
        <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-6">
          <div className="w-full sm:w-auto">
            <DateRangePicker onSubmit={generateReport} className="w-full" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={fetchReports}
              className="w-full sm:w-auto bg-gradient-to-r from-black to-red-600 text-white px-4 sm:px-6 py-2.5 rounded-lg font-semibold hover:from-black hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Refresh Reports
            </button>
            <button
              onClick={exportToCSV}
              disabled={!reports.length}
              className="w-full sm:w-auto bg-gradient-to-r from-black to-yellow-400 text-white px-4 sm:px-6 py-2.5 rounded-lg font-semibold hover:from-black hover:to-yellow-500 transition-all duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              Export to CSV
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 sm:mb-8 p-4 bg-red-900/30 border border-red-700 rounded-lg shadow-md animate-fade-in">
            <p className="text-red-300 text-sm font-medium text-center sm:text-left">{error}</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 sm:p-6 animate-pulse">
                <div className="h-5 sm:h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-7 sm:h-8 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4 sm:p-6 animate-pulse">
              <div className="h-5 sm:h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-48 sm:h-64 bg-gray-700 rounded"></div>
            </div>
          </div>
        )}

        {/* Dashboard Cards */}
        {report && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
            <DashboardCard
              title="Total Orders"
              value={report.total_orders}
              className="bg-gradient-to-br from-gray-800 to-gray-900 hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            />
            <DashboardCard
              title="Total Revenue"
              value={`$${Number(report.total_revenue).toFixed(2)}`}
              className="bg-gradient-to-br from-gray-800 to-gray-900 hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            />
            <DashboardCard
              title="Avg Order Value"
              value={`$${Number(report.avg_order_value).toFixed(2)}`}
              className="bg-gradient-to-br from-gray-800 to-gray-900 hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            />
          </div>
        )}

        {/* Charts */}
        {report && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-[1.01] transition-all duration-300">
              <BarChartComponent
                data={report.region_wise_stats}
                xKey="region"
                yKey="total_revenue"
                label="Revenue by Region"
                tooltipFormatter={(value) => `$${value.toFixed(2)}`}
              />
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-[1.01] transition-all duration-300">
              <PieChartComponent
                data={report.category_wise_stats}
                labelKey="category"
                valueKey="total_revenue"
                tooltipFormatter={(value) => `$${value.toFixed(2)}`}
              />
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-[1.01] transition-all duration-300">
              <BarChartComponent
                data={report.top_products}
                xKey="name"
                yKey="total_sold"
                label="Top Products (Units Sold)"
                tooltipFormatter={(value) => `${value} units`}
              />
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-[1.01] transition-all duration-300">
              <BarChartComponent
                data={report.top_customers}
                xKey="name"
                yKey="total_spent"
                label="Top Customers (Total Spent)"
                tooltipFormatter={(value) => `$${value.toFixed(2)}`}
              />
            </div>
          </div>
        )}

        {/* Report History */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 tracking-tight">Report History</h2>
            <span className="text-xs sm:text-sm text-gray-400">{reports.length} reports</span>
          </div>
          <div className="overflow-x-auto">
            <ReportTable reports={reports} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;