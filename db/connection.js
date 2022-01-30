const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'mike',
    // Your MySQL password
    password: 'password',
    database: 'employee_db'
  },
  console.log('Connected to the employee database.')
);

module.exports = db;