const express = require("express");
const cors = require("cors");

const app = express();

require('dotenv').config();

const CLIENT_PORT = process.env.CLIENT_PORT || 3000;

var corsOptions = {
  origin: `http://localhost:${CLIENT_PORT}`
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (_, res) => {
  res.json({ message: "Company directory API" });
});

require("./src/routes/employee.routes.js")(app);
require("./src/routes/service.routes.js")(app);
require("./src/routes/site.routes.js")(app);
require("./src/routes/user.routes.js")(app);
require("./src/routes/auth.routes.js")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});