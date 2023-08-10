const mysql = require('mysql2');

// List of first names and last names
const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Julie', 'Nicolas', 'Philippe', 'Isabelle', 'David', 'Céline', 'Sylvie', 'Antoine', 'Valérie', 'Olivier', 'Lucie', 'Alexandre', 'Mathilde', 'François', 'Laure', 'Julien', 'Caroline', 'Thomas', 'Sandrine', 'Maxime', 'Audrey', 'Paul', 'Emma', 'Hugo', 'Camille', 'Benoît', 'Chloé', 'Vincent', 'Léa', 'Romain', 'Charlotte', 'Simon', 'Clémence', 'Arthur', 'Marine', 'Guillaume', 'Laura', 'Théo', 'Elodie', 'Gabriel', 'Emilie', 'Alexis', 'Mélanie'];
const lastNames = ['Martin', 'Bernard', 'Thomas', 'Petit', 'Durand', 'Lefebvre', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Michel', 'Rousseau', 'Fournier', 'Girard', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez', 'Dupuis', 'Barbier', 'Guerin', 'Clement', 'Roussel', 'Deviens', 'Denis', 'Nguyen', 'David', 'Muller', 'Klein', 'Blanc', 'Marchand', 'Lopez', 'Perez', 'Morin', 'Lemoine', 'Joly', 'Guillaume', 'Dufour', 'Colin', 'Robin', 'Marie', 'Renard', 'Jean', 'Bourgeois', 'Fabre', 'Fernandez', 'Lacroix'];

// List of phone number formats
const phoneFormats = ['01########', '02########', '03########', '04########', '05########', '06########', '07########', '08########', '09########'];

// List of email domains
const emailDomains = ['orange.fr', 'sfr.fr', 'free.fr', 'bbox.fr', 'laposte.net', 'gmail.com', 'hotmail.com', 'yahoo.fr'];

// MySQL database connection
const db = require('../config/db.config');

// Function to reset auto-increment value of a table
function resetAutoIncrement(table) {
  const resetQuery = `ALTER TABLE ${table} AUTO_INCREMENT = 1`;

  db.query(resetQuery, (err) => {
    if (err) {
      console.error(`Error resetting auto-increment for table ${table}:`, err.message);
    } else {
      console.log(`Auto-increment reset for table ${table}.`);
    }
  });
}

// Function to insert test data into tables
function seedDatabase() {

  // Reset auto-increment values for tables
  resetAutoIncrement('employees');
  resetAutoIncrement('services');
  resetAutoIncrement('sites');

  // Seed data for sites
  const sites = ['Paris', 'Marseille', 'Lyon', 'Bordeaux', 'Toulouse'];
  const insertSiteQuery = 'INSERT INTO sites (city) VALUES (?)';

  sites.forEach((city) => {
    db.query(insertSiteQuery, [city], (err) => {
      if (err) {
        console.error('Error inserting site:', err.message);
      } else {
        console.log(`Site "${city}" inserted successfully.`);
      }
    });
  });

  // Seed data for services
  const services = ['Comptabilité', 'Production', 'Accueil', 'Informatique', 'Commercial'];
  const insertServiceQuery = 'INSERT INTO services (name) VALUES (?)';

  services.forEach((name) => {
    db.query(insertServiceQuery, [name], (err) => {
      if (err) {
        console.error('Error inserting service:', err.message);
      } else {
        console.log(`Service "${name}" inserted successfully.`);
      }
    });
  });

  // Seed data for employees
  const employees = [];
  const totalEmployees = 50;

  for (let i = 1; i <= totalEmployees; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const phone = generateRandomPhone();
    const mobile = generateRandomPhone();
    const email = generateRandomEmail(firstName, lastName);

    const service_id = Math.floor(Math.random() * services.length) + 1;
    const site_id = Math.floor(Math.random() * sites.length) + 1;

    employees.push([firstName, lastName, phone, mobile, email, service_id, site_id]);
  }

  const insertEmployeeQuery = 'INSERT INTO employees (firstName, lastName, phone, mobile, email, service_id, site_id) VALUES ?';

  db.query(insertEmployeeQuery, [employees], (err) => {
    if (err) {
      console.error('Error inserting employee:', err.message);
    } else {
      console.log(`Employee ${employees} inserted successfully.`);
    }
  });
}


// Function to generate a random French phone number
function generateRandomPhone() {
  const phoneFormat = phoneFormats[Math.floor(Math.random() * phoneFormats.length)];
  return phoneFormat.replace(/#/g, () => Math.floor(Math.random() * 10));
}

// Function to generate a random French email
function generateRandomEmail(firstName, lastName) {
  const emailDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  const firstNameLower = firstName.toLowerCase();
  const lastNameLower = lastName.toLowerCase();
  return `${firstNameLower}.${lastNameLower}@${emailDomain}`;
}

// Run the seedDatabase function to populate the tables
seedDatabase();