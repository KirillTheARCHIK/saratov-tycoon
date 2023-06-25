const MicroMQ = require("micromq");
const { applyEndpoints } = require("../microservices");
const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(process.env.DB_URL);
const db = client.db("Saratov-Tycoon-Property");

const app = new MicroMQ({
  name: "property",
  rabbit: {
    url: process.env.RABBIT_URL,
  },
});

const propertyEndpoints = [
  {
    method: "get",
    paths: ["/facility/:id"],
    handler: async (req, res, next) => {
      const { id } = req.params;

      const facilitiesTable = db.collection("facilities");
      const facility = await facilitiesTable.findOne(new ObjectId(id));
      if (facility) {
        res.json(facility);
      } else {
        throw new Error("No found facility");
      }
    },
  },
  {
    method: "get",
    paths: ["/facilities/:userId"],
    handler: async (req, res, next) => {
      const { userId } = req.params;

      const facilitiesTable = db.collection("facilities");
      const facilities = await facilitiesTable.find({userId});
      if (facilities) {
        res.json(facilities);
      } else {
        throw new Error("No found facilities");
      }
    },
  },
  {
    method: "post",
    paths: ["/facility"],
    handler: async (req, res, next) => {
      const newFacility = req.body;

      const facilitiesTable = db.collection("facilities");
      const facility = await facilitiesTable.findOne({osmId: newFacility.osmId});
      if (facility) {
        throw new Error("Cant add existing facility");
      } else {
        const result = await facilitiesTable.insertOne(newFacility);
        res.json({
          ...newFacility,
          _id: result.insertedId,
        });
      }
    },
  },
];

applyEndpoints(propertyEndpoints, app);

app.start();

module.exports = propertyEndpoints;
