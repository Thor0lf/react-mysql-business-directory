module.exports = app => {
    const employees = require("../controllers/employee.controller.js");
    const auth = require("../controllers/auth.controller");

    const router = require("express").Router();
  
    // Create a new Employee
    router.post("/", auth.verifyAdmin, employees.create);
  
    // Retrieve all Employees
    router.get("/", employees.findAll);

    // Retrieve all Employees with authentication
    router.get("/admin/", auth.verifyAdmin, employees.findAll);
 
    // Retrieve a single Employee with id
    router.get("/:id", auth.verifyAdmin, employees.findOne);
  
    // Update a Employee with id
    router.put("/:id", auth.verifyAdmin, employees.update);
  
    // Delete a Employee with id
    router.delete("/:id", auth.verifyAdmin, employees.delete);
  
    // Delete all Employees
    router.delete("/", auth.verifyAdmin, employees.deleteAll);
  
    app.use('/api/employees', router);
  };