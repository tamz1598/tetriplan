const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-users";

const client = new MongoClient(uri);

async function addUser(userID, username, email) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db();
    const collection = database.collection("tetriplan-users");

    const user = {
      userID: userID,
      username: username,
      email: email,
    };

    const result = await collection.insertOne(user);
    console.log(
      `New user inserted with the following id: ${result.insertedId}`
    );

    const query = { userID: userID };
    const findResult = await collection.findOne(query);
    console.log("Found user:", findResult);

    return findResult;
  } finally {
    await client.close();
  }
}

module.exports = addUser;
