const { applyEndpoints } = require("../microservices");
const crypto = require("crypto-js");
const { MongoClient, ObjectId } = require("mongodb");
const Economy = require("../economy");
const client = new MongoClient(process.env.DB_URL);
const db = client.db("Saratov-Tycoon-Auth");

const authEndpoints = [
  {
    method: "post",
    paths: ["/login"],
    handler: async (req, res, next) => {
      const { login, password, _id } = req.body;

      const usersTable = db.collection("users");
      const user = await usersTable.findOne(
        _id
          ? new ObjectId(_id)
          : {
              login,
            }
      );
      if (
        user &&
        (_id ||
          password ==
            crypto.AES.decrypt(user.password, "12345").toString(
              crypto.enc.Utf8
            ) ||
          password == user.password)
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
          money: Economy.START_MONEY,
        });
        res.json({
          login,
          password,
          _id: newUser.insertedId,
        });
      }
    },
  },
  {
    method: "get",
    paths: ["/user/:id"],
    handler: async (req, res, next) => {
      const { id } = req.params;

      const usersTable = db.collection("users");
      const user = await usersTable.findOne(new ObjectId(id));
      if (user) {
        res.json(user);
      } else {
        throw new Error("No found user");
      }
    },
  },
  {
    method: "get",
    paths: ["/users"],
    handler: async (req, res, next) => {
      const usersTable = db.collection("users");
      const users = await usersTable.find().toArray();
      res.json(users);
    },
  },
  {
    method: "post",
    paths: ["/user/:id/money"],
    handler: async (req, res, next) => {
      const { id } = req.params;
      const { money } = req.body;
      if (!money) {
        throw new Error("No money change");
      }

      const usersTable = db.collection("users");
      const user = await usersTable.findOne(new ObjectId(id));
      if (!user) {
        throw new Error("No found user");
      }
      if (user.money + money < 0) {
        throw new Error("Недостаточно денег у пользователя");
      }

      const result = await usersTable.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            money: user.money + money,
          },
        }
      );
      if (result.modifiedCount == 0) {
        throw new Error("Can't change money");
      }
      res.json("success");
    },
  },
];

module.exports = authEndpoints;
