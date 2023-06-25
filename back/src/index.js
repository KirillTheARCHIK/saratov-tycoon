require("dotenv").config();

//microservices
require("./auth/auth");

const Gateway = require("micromq/gateway");
const authEndpoints = require("./auth/auth");
const { applyMicroservices } = require("./microservices");
const propertyEndpoints = require("./property/property");

const microserviceNames = ["auth", "property"];
const app = new Gateway({
  microservices: microserviceNames,
  rabbit: {
    url: process.env.RABBIT_URL,
  },
});

applyMicroservices(app, microserviceNames, [authEndpoints, propertyEndpoints]);

app.listen(process.env.PORT);
