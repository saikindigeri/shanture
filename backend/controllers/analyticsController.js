// Get the database connection
const database = require('../models/db').pool;

// Create a new report
exports.generateAnalyticsReport = async (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Please provide startDate and endDate' });
  }

  let connection;
  try {
    connection = await database.getConnection();

    // Query 1: Summary
    const [summaryRows] = await connection.query(
      'SELECT COUNT(*) as total_orders, SUM(total_price) as total_revenue, AVG(total_price) as avg_order_value FROM orders WHERE order_date BETWEEN ? AND ?',
      [startDate, endDate]
    );
    const summary = summaryRows[0] || {};

    // Query 2: Top Products
    const [topProducts] = await connection.query(
      'SELECT p.product_id, p.name, SUM(o.quantity) as total_sold FROM orders o JOIN products p ON o.product_id = p.product_id WHERE o.order_date BETWEEN ? AND ? GROUP BY p.product_id, p.name ORDER BY total_sold DESC LIMIT 5',
      [startDate, endDate]
    );

    // Query 3: Top Customers
    const [topCustomers] = await connection.query(
      'SELECT c.customer_id, c.name, SUM(o.total_price) as total_spent FROM orders o JOIN customers c ON o.customer_id = c.customer_id WHERE o.order_date BETWEEN ? AND ? GROUP BY c.customer_id, c.name ORDER BY total_spent DESC LIMIT 5',
      [startDate, endDate]
    );

    // Query 4: Region Stats
    const [regionStats] = await connection.query(
      'SELECT region, SUM(total_price) as total_revenue, COUNT(*) as total_orders FROM orders WHERE order_date BETWEEN ? AND ? GROUP BY region',
      [startDate, endDate]
    );

    // Query 5: Category Stats
    const [categoryStats] = await connection.query(
      'SELECT category, SUM(total_price) as total_revenue, COUNT(*) as total_orders FROM orders WHERE order_date BETWEEN ? AND ? GROUP BY category',
      [startDate, endDate]
    );

    // Format numbers
    const totalOrders = Number(summary.total_orders) ?? 0;
    const totalRevenue = Number(summary.total_revenue) ?? 0;
    const avgOrderValue = Number(summary.avg_order_value) ?? 0;

    // Format results
    const formattedTopProducts = topProducts.map(product => ({
      product_id: product.product_id ?? 'Unknown',
      name: product.name ?? 'Unknown Product',
      total_sold: Number(product.total_sold) ?? 0,
    }));

    const formattedTopCustomers = topCustomers.map(customer => ({
      customer_id: customer.customer_id ?? 'Unknown',
      name: customer.name ?? 'Unknown Customer',
      total_spent: Number(customer.total_spent) ?? 0,
    }));

    const formattedRegionStats = regionStats.map(stat => ({
      region: stat.region ?? 'Unknown',
      total_revenue: Number(stat.total_revenue) ?? 0,
      total_orders: Number(stat.total_orders) ?? 0,
    }));

    const formattedCategoryStats = categoryStats.map(stat => ({
      category: stat.category ?? 'Unknown',
      total_revenue: Number(stat.total_revenue) ?? 0,
      total_orders: Number(stat.total_orders) ?? 0,
    }));

    // Save report to database
    const currentDate = new Date().toISOString().split('T')[0];
    const [insertResult] = await connection.query(
      'INSERT INTO analytics_reports (report_date, start_date, end_date, total_orders, total_revenue, avg_order_value, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [currentDate, startDate, endDate, totalOrders, totalRevenue, avgOrderValue, currentDate]
    );

   
    const report = {
      id: insertResult.insertId ?? 0,
      report_date: currentDate,
      start_date: startDate,
      end_date: endDate,
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      avg_order_value: avgOrderValue,
      top_products: formattedTopProducts,
      top_customers: formattedTopCustomers,
      region_wise_stats: formattedRegionStats,
      category_wise_stats: formattedCategoryStats,
      created_at: currentDate,
    };

    console.log(' Generated report:', JSON.stringify(report, null, 2));
    res.status(200).json(report);
  } catch (error) {
    console.error(' Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  } finally {
    connection?.release();
  }
};

// Get all saved reports
exports.getReports = async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();

    const [reports] = await connection.query(
      'SELECT * FROM analytics_reports ORDER BY created_at DESC'
    );

    if (!reports.length) {
      console.log(' No reports found');
      return res.status(200).json([]);
    }

    const formattedReports = reports.map(report => ({
      id: Number(report.id) ?? 0,
      report_date: report.report_date ?? 'Unknown',
      start_date: report.start_date ?? 'Unknown',
      end_date: report.end_date ?? 'Unknown',
      total_orders: Number(report.total_orders) ?? 0,
      total_revenue: Number(report.total_revenue) ?? 0,
      avg_order_value: Number(report.avg_order_value) ?? 0,
      created_at: report.created_at ?? 'Unknown',
    }));

    console.log(' Fetched reports:', JSON.stringify(formattedReports, null, 2));
    res.status(200).json(formattedReports);
  } catch (error) {
    console.error(' Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to get reports' });
  } finally {
    connection?.release();
  }
};
