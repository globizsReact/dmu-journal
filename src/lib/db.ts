
import mysql from 'mysql2/promise';
import fs from 'fs'; // For reading SSL certificate files

const finalPoolOptions: mysql.PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0, // Unlimited queue
};

// Configure SSL if DB_SSL_CA_PATH is provided
if (process.env.DB_SSL_CA_PATH) {
  try {
    finalPoolOptions.ssl = {
      ca: fs.readFileSync(process.env.DB_SSL_CA_PATH),
      // rejectUnauthorized is true by default when 'ca' is supplied,
      // which means the server certificate will be verified against this CA.
      // This is appropriate for DigitalOcean's "sslmode=REQUIRED" where they provide a CA cert.
    };
    console.log('SSL CA certificate loaded for DB connection from:', process.env.DB_SSL_CA_PATH);
  } catch (err) {
    console.error('Error reading SSL CA certificate from path:', process.env.DB_SSL_CA_PATH);
    console.error('Database connection will proceed without SSL CA, which may fail if SSL is required by the server or be insecure.');
    // Depending on policy, you might want to throw an error here to prevent startup
    // throw new Error(`Failed to load SSL CA certificate: ${err.message}`);
  }
} else if (process.env.DB_HOST && (process.env.DB_HOST.includes('digitalocean.com') || process.env.DB_HOST.includes('ondigitalocean.app'))) {
  // Heuristic to detect DigitalOcean managed database hosts
  console.warn(
    'Warning: Connecting to a DigitalOcean DB host without DB_SSL_CA_PATH set in .env.local.' +
    ' The connection will likely fail if the server requires SSL with CA verification.' +
    ' Please download the CA certificate from your DigitalOcean database cluster settings and set DB_SSL_CA_PATH.'
  );
}


// It's recommended to use a connection pool for applications
// as it helps manage multiple simultaneous connections efficiently.
const pool = mysql.createPool(finalPoolOptions);

// Test the connection (optional, but good for diagnostics)
pool.getConnection()
  .then(connection => {
    console.log('Attempting to connect to the MySQL database...');
    // Perform a simple query to ensure the connection is truly active
    return connection.query('SELECT 1')
      .then(() => {
        console.log('Successfully connected to the MySQL database and executed a query.');
        connection.release(); // Release the connection back to the pool
      })
      .catch(queryError => {
        console.error('Error executing a test query on the MySQL database connection:', queryError);
        connection.release();
      });
  })
  .catch(err => {
    console.error('Error establishing a connection to the MySQL database pool:', err);
    // If you cannot connect, you might want to exit the process or handle it gracefully
    // For critical applications, you might throw the error or have a retry mechanism
  });

export default pool;
