const { getUserById } = require("../utils/userUtils");
const {ObjectId} = require('mongodb')

async function main() {
  try {
    const username = "tamya";
    const user = await getUserById(username);
    console.log("User:", user);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
main().catch(console.error);
