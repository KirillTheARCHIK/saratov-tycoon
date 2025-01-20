require("dotenv").config();
const express = require("express");
const cors = require("cors");

//microservices
require("./auth/auth");

const authEndpoints = require("./auth/auth");
const { applyEndpoints } = require("./microservices");
const propertyEndpoints = require("./property/property");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

applyEndpoints(authEndpoints, app);
applyEndpoints(propertyEndpoints, app);

app.listen(process.env.PORT);
