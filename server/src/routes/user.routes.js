module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const auth = require("../controllers/auth.controller");

    const router = require("express").Router();
    
    // Retrieve all Employees
    router.get("/", auth.verifyAdmin, users.findAll);
    
    app.use('/api/users', router);
};