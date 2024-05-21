const { MongoClient, BSON, ObjectId } = require("mongodb");
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

async function getUserById(userId) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    console.log("UserID:", userId);

    const database = client.db();
    const collection = database.collection("tetriplan-users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    console.log("User:", user);

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
  } finally {
    await client.close();
  }
}

async function addUser(username, email, fullName) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db();
    const collection = database.collection("tetriplan-users");

    const user = {
      username: username,
      email: email,
      fullName: fullName,
    };

    const result = await collection.insertOne(user);
    console.log(
      `New user inserted with the following id: ${result.insertedId}`
    );

    return result;
  } finally {
    await client.close();
  }
}

async function deleteUserById(userID) {
  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection("tetriplan-users");
    const result = await collection.deleteOne({ userID: userID });

    if (result.deletedCount === 1) {
      console.log(`User with ID ${userID} deleted successfully`);
    } else {
      console.log(`User with ID ${userID} not found`);
    }
  } finally {
    await client.close();
  }
}

module.exports = { addUser, deleteUserById, getAllUsers, getUserById };
