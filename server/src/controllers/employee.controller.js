const Employee = require("../models/employee.model");

// Create and Save a new Employee
exports.create = (req, res) => {
    // Validate request
    if (!req.body.firstName  || 
        !req.body.lastName   || 
        !req.body.phone      || 
        !req.body.mobile     || 
        !req.body.email) {
      return res.status(400).send({
        message: "Un des champs est vide !"
      });
    }

    if (!req.body.service_id) {
      return res.status(400).send({
        message: "Le service n'a pas été sélectionné !"
      });
    }

    if (!req.body.site_id) {
      return res.status(400).send({
        message: "Le site n'a pas été sélectionné !"
      });
    }
  
    // Create an Employee
    const employee = new Employee({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        mobile: req.body.mobile,
        email: req.body.email,
        service_id: req.body.service_id,
        site_id: req.body.site_id
    });
  
    // Save Employee in the database
    Employee.create(employee, (err, data) => {
      if (err) {
        return res.status(500).send({
            message:
            "Une erreur est servenue. Veuillez recommencer !"
        });
      } 
      return res.status(200).send({
        data, message: `${employee.firstName} ${employee.lastName} a été créé avec succès !`
      });
      
    });
};

// Retrieve all Employees from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.query.name;
  const serviceId = req.query.service_id;
  const siteId = req.query.site_id;
  const limit = parseInt(req.query.limit) || 1500;
  const offset = parseInt(req.query.offset) || 0;

  if (serviceId) {
    // If service_id is queried, filter by service
    Employee.getAllByService(serviceId, limit, offset, (err, data) => {
      if (err) {
        return res.status(500).send({
          message: "Erreur lors du chargement des données de services. Veuillez recommencer.",
        });
      } else {
        return res.send(data);
      }
    });
  } else if (siteId) {
    // If site_id is queried, filter by site
    Employee.getAllBySite(siteId, limit, offset, (err, data) => {
      if (err) {
        return res.status(500).send({
          message: "Erreur lors du chargement des données de sites. Veuillez recommencer.",
        });
      } else {
        return res.send(data);
      }
    });
  } else {
    // else, filter by bame
    Employee.getAll(name, limit, offset, (err, data) => {
      if (err) {
        return res.status(500).send({
          message: "Erreur lors du chargement des données des employés. Veuillez recommencer.",
        });
      } else {
        return res.send(data);
      }
    });
  }
};

// Find a single Employee with its id
exports.findOne = (req, res) => {
    Employee.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Aucun employé n'a été trouvé avec l'ID: ${req.params.id}.`
          });
        } else {
          return res.status(500).send({
            message: "Erreur lors du chargement des données. Veuillez recommencer."
          });
        }
      } else res.send(data);
    });
};

// Update an Employee identified by the id in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body.firstName || 
      !req.body.lastName    || 
      !req.body.phone       || 
      !req.body.mobile      || 
      !req.body.email) {
        return res.status(400).send({
          message: "Un des champs est vide !"
        });
    }

    if (!req.body.service_id) {
      return res.status(400).send({
        message: "Le service n'a pas été sélectionné !"
      });
    }

    if (!req.body.site_id) {
      return res.status(400).send({
        message: "Le site n'a pas été sélectionné !"
      });
    }

    const employee = new Employee(req.body);
  
    Employee.updateById(
      req.params.id,
      employee,
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(404).send({
              message: `Aucun employé n'a été trouvé avec l'ID: ${req.params.id}.`
            });
          } else {
            return res.status(500).send({
              message: "Erreur lors de la mise à jour de l'employé. Veuillez recommencer."
            });
          }
        } else return res.status(200).send({data, message: `${employee.firstName} ${employee.lastName} a été mis à jour`});
      }
    );
};

// Delete an Employee with the specified id in the request
exports.delete = (req, res) => {
    Employee.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Aucun employé n'a été trouvé avec l'ID: ${req.params.id}.`
          });
        } else {
          return res.status(500).send({
            message: "Erreur lors de la suppression de l'employé. Veuillez recommencer."
          });
        }
      } else return res.status(200).send({ message: "L'employé a bien été supprimé." });
    });
};

// Delete all Employees from the database.
exports.deleteAll = (req, res) => {
    Employee.removeAll((err, data) => {
      if (err)
        return res.status(500).send({
          message:
            "Erreur lors de la suppression de tous les employés. Veuillez recommencer."
        });
      else return res.status(200).send({ message: `Tous les employés ont bien été supprimés !` });
    });
};