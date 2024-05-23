require('dotenv').config();
const { MongoClient, BSON, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_CONNECT_URI);

async function getAllUsers() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-users");
    const users = await collection.find({}).toArray();
    console.log("All Users:", users);
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Could not fetch users");
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
    if (!user) {
      console.log("No user found with the given ID");
      return null;
    }
    console.log("User:", user);
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Could not fetch user");
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
    const existingUser = await collection.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      console.log("User already exists with the given email or username");
      return { message: "User already exists" };
    }
    const user = {
      username,
      email,
      fullName,
    };
    const result = await collection.insertOne(user);
    console.log(
      `New user inserted with the following id: ${result.insertedId}`
    );
    return result;
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Could not add user");
  } finally {
    await client.close();
  }
}
async function deleteUserById(userID) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-users");
    const result = await collection.deleteOne({ _id: new ObjectId(userID) });
    if (result.deletedCount === 1) {
      console.log(`User with ID ${userID} deleted successfully`);
    } else {
      console.log(`User with ID ${userID} not found`);
    }
    return result;
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    throw new Error("Could not delete user");
  } finally {
    await client.close();
  }
}

async function patchUser(userID, updatedFields) {
  console.log(userID)
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db();
    const collection = database.collection("tetriplan-users");

    const result = await collection.updateOne(
      { _id: new ObjectId(userID) },
      { $set: updatedFields }
    );

    if (result.modifiedCount === 1) {
      console.log(`User with ID ${userID} patched/updated successfully`);
    } else {
      console.log(`User with ID ${userID} not found`);
    }
  } finally {
    await client.close();
  }
}

module.exports = { addUser, deleteUserById, getAllUsers, getUserById, patchUser };
