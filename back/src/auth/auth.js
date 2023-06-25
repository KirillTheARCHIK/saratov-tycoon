const MicroMQ = require("micromq");
const { applyEndpoints } = require("../microservices");
const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(process.env.DB_URL);
const db = client.db("Saratov-Tycoon-Auth");

const app = new MicroMQ({
  name: "auth",
  rabbit: {
    url: process.env.RABBIT_URL,
  },
});

const authEndpoints = [
  {
    method: "post",
    paths: ["/login"],
    handler: async (req, res, next) => {
      const { login, password, id } = req.body;

      const usersTable = db.collection("users");
      const user = await usersTable.findOne(
        id ? new ObjectId(id) : { login, password }
      );
      if (user) {
        res.json(user);
      } else {
        throw new Error("No found user");
      }
    },
  },
];

applyEndpoints(authEndpoints, app);

app.start();

module.exports = authEndpoints;
