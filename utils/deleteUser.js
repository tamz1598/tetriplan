const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://admin:tetriplan@cluster0.spo41rp.mongodb.net/tetriplan-users";

const client = new MongoClient(uri);
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
module.exports = deleteUserById;
