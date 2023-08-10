const Service = require("../models/service.model");

// Create and Save a new v
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
      return res.status(400).send({
        message: "Le service doit avoir un nom !"
      });
    }
  
    // Create a Service
    const service = new Service({
      name: req.body.name,
    });
  
    // Save Service in the database
    Service.create(service, (err, data) => {
      if (err)
        return res.status(500).send({
          message: "Erreur lors de la création du service. Veuillez recommencer."
      });
      else return res.status(200).send({data, message : `Le service ${service.name} a été créé.`});
    });
};

// Retrieve all Services from the database (with condition).
exports.findAll = (req, res) => {
    const name = req.query.name;
  
    Service.getAll(name, (err, data) => {
      if (err)
        return res.status(500).send({
          message:
            "Erreur lors du chargement des données. Veuillez recommencer."
        });
      else return res.send(data);
    });
};

// Find a single Service with a id
exports.findOne = (req, res) => {
    Service.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Aucun service n'a été trouvé avec l'ID: ${req.params.id}.`
          });
        } else {
          return res.status(500).send({
            message: "Erreur lors du chargement des données. Veuillez recommencer."
          });
        }
      } else return res.send(data);
    });
};

// Update a Service identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.name) {
      res.status(400).send({
        message: "Le service doit avoir un nom !"
      });
    }
    
    const service = new Service(req.body);

    Service.updateById(
      req.params.id,
      service,
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(404).send({
              message: `Aucun service n'a été trouvé avec l'ID: ${req.params.id}.`
            });
          } else {
            return res.status(500).send({
              message: "Erreur lors de la misa à jour des données. Veuillez recommencer."
            });
          }
        } else return res.status(200).send({data, message: `Le service ${service.name} a bien été mis à jour.`});
      }
    );
};

// Delete a Service with the specified id in the request
exports.delete = (req, res) => {
    Service.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Aucun service n'a été trouvé avec l'ID: ${req.params.id}.`
          });
        } else if (err.kind === "foreign_key_contraint") {
          return res.status(409).send({
            message: "Au moins un employé utilise ce service, qui ne peut donc pas être supprimé."
          });
        } else {
          return res.status(500).send({
            message: "Erreur lors de la suppression du service. Veuillez recommencer."
          });
        }
      } else return res.status(200).send({ message: `Le service a bien été supprimé !` });
    });
};