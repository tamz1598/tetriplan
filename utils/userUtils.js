require('dotenv').config();
const { MongoClient, BSON, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_CONNECT_URI);

async function getAllUsers(req, res) {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-users");
    const users = await collection.find({}).toArray();
    console.log("All Users:", users);
    res.status(200).json(users);
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Could not fetch users" });
  } finally {
    await client.close();
  }
}
async function getUserById(req, res) {
  const { userId } = req.params;
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    console.log("UserID:", userId);
    const database = client.db();
    const collection = database.collection("tetriplan-users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      console.log("No user found with the given ID");
      res.status(404).json({ message: "No user found with the given ID" });
    }
    console.log("User:", user);
    res.status(200).json(user);
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Could not fetch user" });
  } finally {
    await client.close();
  }
}
async function addUser(req, res) {
  const { username, email, fullName } = req.body;
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
      res.status(400).json({ message: "User already exists" });
    } else {
    const user = {
      username,
      email,
      fullName,
      };
      const result = await collection.insertOne(user);
      console.log(
        `New user inserted with the following id: ${result.insertedId}`
      );
      res.status(201).json({ message: `New user inserted with ID: ${result.insertedId}` }); // Send 201 for created
      return result;
    }
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Could not add user" });
  } finally {
    await client.close();
  }
}
async function deleteUserById(req, res) {
  const { userID } = req.params;
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-users");
    const result = await collection.deleteOne({ _id: new ObjectId(userID) });
    if (result.deletedCount === 1) {
      console.log(`User with ID ${userID} deleted successfully`);
      res.status(200).json({ message: `User with ID ${userID} deleted successfully` });
    } else {
      console.log(`User with ID ${userID} not found`);
      res.status(404).json({ message: `User with ID ${userID} not found` }); 
    }
    return result;
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    res.status(500).json({ error: "Could not delete user" });
  } finally {
    await client.close();
  }
}

async function patchUser(req, res) {
  const { userID } = req.params;
  const updatedFields = req.body; 
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
      res.status(200).json({ message: `User with ID ${userID} patched/updated successfully` });
    } else {
      console.log(`User with ID ${userID} not found`);
      res.status(404).json({ message: `User with ID ${userID} not found` });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Could not update user" }); 
  } finally {
    await client.close();
  }
}

module.exports = { addUser, deleteUserById, getAllUsers, getUserById, patchUser };
