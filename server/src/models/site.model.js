const sql = require("../../config/db.config");

// constructor
const Site = function(site) {
  this.city = site.city;
};

Site.create = (newSite, result) => {
  sql.query("INSERT INTO sites SET ?", newSite, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created site: ", { id: res.insertId, ...newSite });
    result(null, { id: res.insertId, ...newSite });
  });
};

Site.findById = (id, result) => {
  sql.query(`SELECT * FROM sites WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found site: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Site with the id
    result({ kind: "not_found" }, null);
  });
};

Site.getAll = (name, result) => {
  let query = "SELECT * FROM sites";

  if (name) {
    query += ` WHERE city LIKE '%${city}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("sites: ", res);
    result(null, res);
  });
};

Site.updateById = (id, site, result) => {
  sql.query(
    "UPDATE sites SET city = ? WHERE id = ?",
    [site.city, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Site with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated site: ", { id: id, ...site });
      result(null, { id: id, ...site });
    }
  );
};

Site.remove = (id, result) => {
  sql.query("DELETE FROM sites WHERE id = ?", id, (err, res) => {
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
      // not found Site with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted site with id: ", id);
    result(null, res);
  });
};

module.exports = Site;