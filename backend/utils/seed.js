const { pool } = require('../models/db');

async function seedDB() {
  // Dynamically import faker
  const { fakerDE: faker } = await import('@faker-js/faker');

  const connection = await pool.getConnection();
  try {
    // Clear existing data
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE orders');
    await connection.query('TRUNCATE TABLE customers');
    await connection.query('TRUNCATE TABLE products');
    await connection.query('TRUNCATE TABLE analytics_reports');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // Seed Customers
    const customers = Array.from({ length: 100 }, () => ({
      customer_id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      type: faker.helpers.arrayElement(['regular', 'premium']),
    }));
    await connection.query(
      'INSERT INTO customers (customer_id, name, email, type) VALUES ?',
      [customers.map(c => [c.customer_id, c.name, c.email, c.type])]
    );

    // Seed Products
    const products = Array.from({ length: 50 }, () => ({
      product_id: faker.string.uuid(),
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(['Electronics', 'Clothing', 'Books']),
      price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
    }));
    await connection.query(
      'INSERT INTO products (product_id, name, category, price) VALUES ?',
      [products.map(p => [p.product_id, p.name, p.category, p.price])]
    );

    // Seed Orders
    const orders = Array.from({ length: 1000 }, () => ({
      order_id: faker.string.uuid(),
      customer_id: faker.helpers.arrayElement(customers).customer_id,
      product_id: faker.helpers.arrayElement(products).product_id,
      quantity: faker.number.int({ min: 1, max: 10 }),
      total_price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      order_date: faker.date.between({ from: '2023-01-01', to: '2025-09-18' }).toISOString().split('T')[0],
      region: faker.helpers.arrayElement(['North', 'South', 'East', 'West']),
      category: faker.helpers.arrayElement(['Electronics', 'Clothing', 'Books']),
    }));
    await connection.query(
      'INSERT INTO orders (order_id, customer_id, product_id, quantity, total_price, order_date, region, category) VALUES ?',
      [orders.map(o => [o.order_id, o.customer_id, o.product_id, o.quantity, o.total_price, o.order_date, o.region, o.category])]
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    connection.release();
    pool.end();
  }
}

seedDB();