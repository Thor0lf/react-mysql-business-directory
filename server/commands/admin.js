const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const db = require('../config/db.config');

async function seedUserDatabase() {
    // Seed data for users
    const users = [];
    const totalEmployees = 1;

    for (let i = 1; i <= totalEmployees; i++) {
        const id = uuidv4();
        const fullname = 'Admin';
        const email = 'admin@admin.fr';

        const password = 'admin';
        const hashedPassword = await bcrypt.hash(password, 10);
        const isAdmin = true;

        users.push([id, fullname, email, hashedPassword, isAdmin]);
    }

    const insertUserQuery = 'INSERT INTO users (id, fullname, email, password, isAdmin) VALUES ?';

    db.query(insertUserQuery, [users], (err) => {
        if (err) {
            console.error('Error inserting user:', err.message);
        } else {
            console.log(`User(s) inserted successfully.`);
        }
    });
}

// Run the seedUserDatabase function to populate the table
seedUserDatabase();