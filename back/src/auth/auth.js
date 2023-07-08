const MicroMQ = require("micromq");
const { applyEndpoints } = require("../microservices");
const crypto = require("crypto-js");
const { MongoClient, ObjectId } = require("mongodb");
const { START_MONEY } = require("../economy");
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
        id
          ? new ObjectId(id)
          : {
              login,
            }
      );
      if (
        user &&
        (id || password == crypto.AES.decrypt(user.password, "12345").toString(crypto.enc.Utf8) || password == user.password)
      ) {
        res.json(user);
      } else {
        throw new Error("Неправильный логин или пароль");
      }
    },
  },
  {
    method: "post",
    paths: ["/register"],
    handler: async (req, res, next) => {
      const { login, password } = req.body;

      const usersTable = db.collection("users");
      const foundUser = await usersTable.findOne({ login });
      if (foundUser) {
        throw new Error("Пользователь с таким логином уже существует");
      } else {
        if (!login || !password) {
          throw new Error("Нет логина или пароля");
        }
        const newUser = await usersTable.insertOne({
          login,
          password: crypto.AES.encrypt(password, "12345").toString(),
          money: START_MONEY,
        });
        res.json({
          login,
          password,
          _id: newUser.insertedId,
        });
      }
    },
  },
];

applyEndpoints(authEndpoints, app);

app.start();

module.exports = authEndpoints;
