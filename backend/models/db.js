const pool = require('../config/db');

async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL
      )
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36),
        product_id VARCHAR(36),
        quantity INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        order_date DATE NOT NULL,
        region VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      )
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS analytics_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        report_date DATETIME NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_orders INT NOT NULL,
        total_revenue DECIMAL(15, 2) NOT NULL, -- Ensure DECIMAL type
        avg_order_value DECIMAL(10, 2) NOT NULL, -- Ensure DECIMAL type
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { pool, initializeDatabase };