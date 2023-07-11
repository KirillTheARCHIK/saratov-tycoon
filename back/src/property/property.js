const MicroMQ = require("micromq");
const { applyEndpoints } = require("../microservices");
const { MongoClient, ObjectId } = require("mongodb");
const { default: axios } = require("axios");
const { http } = require("../utils/http");
const Economy = require("../economy");
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
    method: "post",
    paths: ["/facilityInfo"],
    handler: async (req, res, next) => {
      console.log("/facilityInfo");
      const { coords, facilityId } = req.body;

      if (!coords) {
        throw new Error("No coords");
      }

      const facilitiesTable = db.collection("facilities");
      let facility;
      if (facilityId) {
        facility = await facilitiesTable.findOne(new ObjectId(facilityId));
        res.json(facility);
      } else {
        const mapInfo = await axios
          .get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`
          )
          .then((value) => value.data);
        facility = await facilitiesTable.findOne({
          "mapInfo.osm_id": mapInfo.osm_id,
        });
        if (facility) {
          res.json(facility);
        } else {
          facility = { mapInfo };
          if (!facility.mapInfo.address.house_number) {
            throw new Error("Здесь нет дома");
          }
          facility.name = `${facility.mapInfo.address.road?.replace(
            "улица",
            "ул."
          )} ${facility.mapInfo.address.house_number}`;
          facility.cost = Economy.calculateFacilityCost(facility);
          res.json(facility);
        }
      }
    },
  },
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
    paths: ["/facilities"],
    handler: async (req, res, next) => {
      const facilitiesTable = db.collection("facilities");
      const facilities = await facilitiesTable.find().toArray();

      res.json(facilities);
    },
  },
  {
    method: "get",
    paths: ["/facilities/:userId"],
    handler: async (req, res, next) => {
      const { userId } = req.params;

      const facilitiesTable = db.collection("facilities");
      const facilities = await facilitiesTable.find({ userId }).toArray();

      res.json(facilities);
    },
  },
  {
    method: "post",
    paths: ["/facility"],
    handler: async (req, res, next) => {
      const newFacility = req.body;

      const facilitiesTable = db.collection("facilities");
      const facility = await facilitiesTable.findOne({
        mapInfo: { osm_id: newFacility.mapInfo.osm_id },
      });
      if (facility) {
        throw new Error("Cant add existing facility");
      }

      if (!newFacility.userId) {
        throw new Error("Не передан номер владельца 'userId'");
      }
      const user = (await http.get(`/user/${newFacility.userId}`)).data;
      if (!user) {
        throw new Error("No found user");
      }
      // console.log(user);

      await http
        .post(`/user/${newFacility.userId}/money`, {
          money: -newFacility.cost,
        })
        .catch((e) => {
          throw new Error(e.response.data.message);
        });

      const result = await facilitiesTable.insertOne(newFacility);
      res.json({
        ...newFacility,
        _id: result.insertedId,
      });
      // res.json("success");
    },
  },
];

applyEndpoints(propertyEndpoints, app);

app.start();

const refreshInterval = 10; //Интервал в секундах
async function refresh() {
  const users = (await http.get("/users")).data;
  const facilitiesTable = db.collection("facilities");
  for (const user of users) {
    const facilities = await facilitiesTable
      .find({ userId: user._id })
      .toArray();
    if (facilities.length) {
      let sum = 0;
      for (const facility of facilities) {
        const facilityCost = facility.cost;
        let intervalProfit =
          (facilityCost * Economy.DAY_PROFIT_COEFFICIENT * refreshInterval) /
          (60 * 60 * 24);
        sum += intervalProfit;
      }
      await http.post(`/user/${user._id}/money`, { money: sum });
    }
  }
}

setInterval(() => {
  refresh();
}, refreshInterval * 1000);

module.exports = propertyEndpoints;
