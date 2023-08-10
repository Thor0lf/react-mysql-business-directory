const sql = require("../../config/db.config");

// constructor
const Employee = function(employee) {
  this.firstName = employee.firstName;
  this.lastName = employee.lastName;
  this.phone = employee.phone;
  this.mobile = employee.mobile;
  this.email = employee.email;
  this.service_id = employee.service_id;
  this.site_id = employee.site_id;
};

Employee.create = (newEmployee, result) => {
  sql.query("INSERT INTO employees SET ?", newEmployee, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created employee: ", { id: res.insertId, ...newEmployee });
    result(null, { id: res.insertId, ...newEmployee });
  });
};

Employee.findById = (id, result) => {
  sql.query(`SELECT * FROM employees WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found employee: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Employee with the id
    result({ kind: "not_found" }, null);
  });
};

Employee.getAll = (name, limit, offset, result) => {
    let query = "SELECT * FROM employees";

    if (name) {
        query += ` WHERE LOWER(firstName) LIKE LOWER('%${name}%') OR LOWER(lastName) LIKE LOWER('%${name}%')`;
    }

    query += " ORDER BY lastName ASC"; // Ajout de la clause ORDER BY
    query += ` LIMIT ${limit} OFFSET ${offset}`; // Ajout de la pagination

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("employees: ", res);
        result(null, res);
    });
};

Employee.getAllByService = (serviceId, limit, offset, result) => {
  let query = "SELECT * FROM employees";

  if (serviceId) {
    query += ` WHERE service_id = ${serviceId}`;
  }

  query += " ORDER BY lastName ASC";
  query += ` LIMIT ${limit} OFFSET ${offset}`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("employees: ", res);
    result(null, res);
  });
};

Employee.getAllBySite = (siteId, limit, offset, result) => {
  let query = "SELECT * FROM employees";

  if (siteId) {
    query += ` WHERE site_id = ${siteId}`;
  }

  query += " ORDER BY lastName ASC";
  query += ` LIMIT ${limit} OFFSET ${offset}`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("employees: ", res);
    result(null, res);
  });
};

Employee.updateById = (id, employee, result) => {
  sql.query(
    "UPDATE employees SET firstName = ?, lastName = ?, phone = ?, mobile = ?, email = ?, service_id = ?, site_id = ? WHERE id = ?",
    [employee.firstName, employee.lastName, employee.phone, employee.mobile, employee.email, employee.service_id, employee.site_id, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Employee with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated employee: ", { id: id, ...employee });
      result(null, { id: id, ...employee });
    }
  );
};

Employee.remove = (id, result) => {
  sql.query("DELETE FROM employees WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Employee with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted employee with id: ", id);
    result(null, res);
  });
};

Employee.removeAll = result => {
  sql.query("DELETE FROM employees", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} employees`);
    result(null, res);
  });
};

module.exports = Employee;