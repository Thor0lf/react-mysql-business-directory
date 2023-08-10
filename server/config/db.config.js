const mysql = require('mysql2');

require('dotenv').config();

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

const databaseName = process.env.DATABASE || 'business_directory_database';

db.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`, (err) => {
  if (err) {
    console.error('Error selecting the database :', err);
    db.end();
    return;
  }
})

db.query(`USE ${databaseName}`, (err) => {
  if (err) {
    console.error('Error creating the database :', err);
} else {
    console.log('The database is (already) created');
}
})

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database.');

    // Create tables
    createTables();
  }
});

// Function to create tables in the database
function createTables() {

  const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT true
  )`;
    
  const createSitesTableQuery = `
    CREATE TABLE IF NOT EXISTS sites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      city VARCHAR(255) NOT NULL UNIQUE
    )
  `;

  const createServicesTableQuery = `
    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE
    )
  `;

  const createEmployeesTableQuery = `
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      service_id INT NOT NULL,
      site_id INT NOT NULL,
      FOREIGN KEY (service_id) REFERENCES services(id),
      FOREIGN KEY (site_id) REFERENCES sites(id)
    )
  `;

  db.query(createUserTableQuery, (err) => {
    if (err) {
        console.error('Error creating "users" table:', err.message);
    } else {
        console.log('Table "users" created successfully.');
    }
  });

  db.query(createSitesTableQuery, (err) => {
    if (err) {
      console.error('Error creating "sites" table:', err.message);
    } else {
      console.log('Table "sites" created successfully.');
    }
  });

  db.query(createServicesTableQuery, (err) => {
    if (err) {
      console.error('Error creating "services" table:', err.message);
    } else {
      console.log('Table "services" created successfully.');
    }
  });

  db.query(createEmployeesTableQuery, (err) => {
    if (err) {
      console.error('Error creating "employees" table:', err.message);
    } else {
      console.log('Table "employees" created successfully.');
    }
  });
}

module.exports = db;