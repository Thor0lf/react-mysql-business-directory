module.exports = app => {
    const services = require("../controllers/service.controller.js");
    const auth = require("../controllers/auth.controller");

    const router = require("express").Router();
  
    // Create a new Service
    router.post("/", auth.verifyAdmin, services.create);
  
    // Retrieve all Services
    router.get("/", services.findAll);

    // Retrieve all Services with authentication
    router.get("/admin/", auth.verifyAdmin, services.findAll);
 
    // Retrieve a single Service with id
    router.get("/:id", services.findOne);

    // Retrieve a single Service with id with authentication
    router.get("/admin/:id", auth.verifyAdmin, services.findOne);
  
    // Update a Service with id
    router.put("/:id", auth.verifyAdmin, services.update);
  
    // Delete a Service with id
    router.delete("/:id", auth.verifyAdmin, services.delete);
  
    app.use('/api/services', router);
  };