const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-users";

const client = new MongoClient(uri);

async function getAllUsers() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db();
    const collection = database.collection("tetriplan-users");

    const users = await collection.find({}).toArray();
    console.log("All Users:", users);

    return users;
  } finally {
    await client.close();
  }
}

module.exports = getAllUsers;
