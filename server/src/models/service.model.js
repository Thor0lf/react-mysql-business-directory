const sql = require("../../config/db.config");

// constructor
const Service = function(service) {
  this.name = service.name;
};

Service.create = (newService, result) => {
  sql.query("INSERT INTO services SET ?", newService, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created service: ", { id: res.insertId, ...newService });
    result(null, { id: res.insertId, ...newService });
  });
};

Service.findById = (id, result) => {
  sql.query(`SELECT * FROM services WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found service: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Service with the id
    result({ kind: "not_found" }, null);
  });
};

Service.getAll = (name, result) => {
  let query = "SELECT * FROM services";

  if (name) {
    query += ` WHERE title LIKE '%${name}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("services: ", res);
    result(null, res);
  });
};

Service.updateById = (id, service, result) => {
  sql.query(
    "UPDATE services SET name = ? WHERE id = ?",
    [service.name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Service with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated service: ", { id: id, ...service });
      result(null, { id: id, ...service });
    }
  );
};

Service.remove = (id, result) => {
  sql.query("DELETE FROM services WHERE id = ?", id, (err, res) => {
    if (err) {
      // foreign key contraint fails
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        result({kind: "foreign_key_contraint"}, null);
        return
      }
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Service with the id
      result({ kind: "not_found" }, null);
      return;
    }


    console.log("deleted service with id: ", id);
    result(null, res);
  });
};

module.exports = Service;