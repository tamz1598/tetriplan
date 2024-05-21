const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-users";

const client = new MongoClient(uri);

async function getUserById(userId) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db();
    const collection = database.collection("tetriplan-users");

    const user = await collection.findOne({ userID: userId });
    console.log("User:", user);

    return user;
  } finally {
    await client.close();
  }
}

module.exports = getUserById;
