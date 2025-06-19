
import mysql from 'mysql2/promise';

// It's recommended to use a connection pool for applications
// as it helps manage multiple simultaneous connections efficiently.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0, // Unlimited queue
});

// Test the connection (optional, but good for diagnostics)
pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to the MySQL database.');
    connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error('Error connecting to the MySQL database:', err);
    // If you cannot connect, you might want to exit the process or handle it gracefully
    // For critical applications, you might throw the error or have a retry mechanism
  });

export default pool;
