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
    res.status(200).json({users});
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Could not fetch users" });
  } finally {
    await client.close();
  }
}

async function getUserById(req, res) {
  const { username } = req.params;
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    console.log("UserID:", username);
    const database = client.db();
    const collection = database.collection("tetriplan-users");
    const user = await collection.findOne({ username });
    if (!user) {
      console.log("No user found with the given ID");
      res.status(404).json({ message: "user not found" });
      responseSent = true;
      return; 
    }
    console.log("User:", user);
    res.status(200).json({user});
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "internal server error" });
    // Check if response has already been sent
    if (!responseSent) {
      res.status(500).json({ error: "internal server error" });
      responseSent = true;
    }
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

    const existingUser = await collection.findOne({ username });

      if (existingUser) {
        console.log("username taken");
        res.status(400).json({ message: "username taken" });
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
      res.status(201).json({
        savedUser: {
        userID: result.insertedId.toString(),
        username,
        email,
        fullName,
        } 
      }); // Send 201 for created
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
  const { username } = req.params;
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db();
    const collection = database.collection("tetriplan-users");

    const user = await collection.findOne({username})
    console.log(user._id)

    const result = await collection.deleteOne({ _id: user._id });
    if (result.deletedCount === 1) {
      console.log(`User deleted successfully`);
      res.status(204).json({ message: `User deleted successfully` });
    } else {
      console.log(`User  not found`);
      res.status(404).json({ message: `User not found` }); 
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
  const { username } = req.params;
  const updatedFields = req.body;

  console.log(username, updatedFields)

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db();
    const collection = database.collection("tetriplan-users");

    const user = await collection.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user._id)

    const result = await collection.findOneAndUpdate(
      { _id: user._id },
      { $set: updatedFields },
      { returnOriginal: false, returnDocument: 'after' }
    );

    console.log(result)

    if (result) {
      console.log(`User patched/updated successfully`);
      res.status(202).json({ update: result });
    } else {
      console.log(`User not found`);
      res.status(404).json({ message: `User not found` });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Could not update user" }); 
  } finally {
    await client.close();
  }
}

module.exports = { addUser, deleteUserById, getAllUsers, getUserById, patchUser };
