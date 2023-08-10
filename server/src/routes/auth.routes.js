module.exports = app => {
    const users = require("../controllers/auth.controller.js");
  
    const router = require("express").Router();
      
    // Create a new Employee
    router.post("/login", users.signin);
  
    app.use('/api', router);
};