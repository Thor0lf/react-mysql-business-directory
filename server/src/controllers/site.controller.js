const Site = require("../models/site.model");

// Create and Save a new Site
exports.create = (req, res) => {
    // Validate request
    if (!req.body.city) {
      return res.status(400).send({
        message: "Le site doit avoir un nom de ville !"
      });
    }
  
    // Create a Site
    const site = new Site({
      city: req.body.city,
    });
  
    // Save Site in the database
    Site.create(site, (err, data) => {
      if (err)
        res.status(500).send({
          message: "Erreur lors de la création du service. Veuillez recommencer."
        });
      else return res.status(200).send({data, message : `Le site ${site.city} a été créé.`});
    });
};

// Retrieve all Sites from the database (with condition).
exports.findAll = (req, res) => {
    const city = req.query.city;
  
    Site.getAll(city, (err, data) => {
      if (err)
        return res.status(500).send({
          message: "Erreur lors du chargement des données. Veuillez recommencer."
        });
      else return res.send(data);
    });
};

// Find a single Site with a id
exports.findOne = (req, res) => {
    Site.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Aucun site n'a été trouvé avec l'ID: ${req.params.id}.`
          });
        } else {
          return res.status(500).send({
            message: "Erreur lors du chargement des données. Veuillez recommencer."
          });
        }
      } else return res.send(data);
    });
};

// Update a Site identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.city) {
      res.status(400).send({
        message: "Le site doit avoir un nom de ville !"
      });
    }
  
    const site = new Site(req.body);
  
    Site.updateById(
      req.params.id,
      site,
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
        } else return res.status(200).send({data, message: `Le site ${site.name} a bien été mis à jour.`});
      }
    );
};

// Delete a Site with the specified id in the request
exports.delete = (req, res) => {
    Site.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Aucun site n'a été trouvé avec l'ID: ${req.params.id}.`
          });
        } else if (err.kind === "foreign_key_contraint") {
          return res.status(409).send({
            message: "Au moins un employé utilise ce site, qui ne peut donc pas être supprimé."
          });
        }  else {
          res.status(500).send({
            message: "Erreur lors de la suppression du site. Veuillez recommencer."
          });
        }
      } else res.send({ message: `Le site a bien été supprimé !` });
    });
};