const sql = require("../../config/db.config");
const bcrypt = require ("bcrypt");

const User = function(user) {
  this.fullname = user.fullname;
  this.email = user.email;
  this.password = user.password;
  this.isAdmin = user.isAdmin;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.getAll = (result) => {
    const query = "SELECT * FROM users";
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("users: ", res);
      result(null, res);
    });
};


User.login = (email, password) => {
    return new Promise((resolve, reject) => {
      sql.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (results.length === 0) {
          resolve(null); // Aucun utilisateur trouvé avec cet e-mail
          return;
        }
        
        const user = results[0];
  
        // Comparer le mot de passe haché stocké avec le mot de passe fourni
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            reject(err);
            return;
          }
  
          if (!match) {
            resolve(null); // Mot de passe incorrect
            return;
          }
  
          resolve(user);
        });
      });
    });
};

module.exports = User;