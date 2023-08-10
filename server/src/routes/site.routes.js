module.exports = app => {
    const sites = require("../controllers/site.controller.js");
    const auth = require("../controllers/auth.controller");

    const router = require("express").Router();
  
    // Create a new Site
    router.post("/", auth.verifyAdmin, sites.create);
  
    // Retrieve all Sites
    router.get("/", sites.findAll);

    // Retrieve all Sites with authentication
    router.get("/admin/", auth.verifyAdmin, sites.findAll);
 
    // Retrieve a single Site with id
    router.get("/:id", sites.findOne);

    // Retrieve a single Site with id with authentication
    router.get("/admin/:id", auth.verifyAdmin, sites.findOne);
  
    // Update a Site with id
    router.put("/:id", auth.verifyAdmin, sites.update);
  
    // Delete a Site with id
    router.delete("/:id", auth.verifyAdmin, sites.delete);

    app.use('/api/sites', router);
  };