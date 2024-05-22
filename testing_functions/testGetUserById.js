const { getUserById } = require("../utils/userUtils");
const {ObjectId} = require('mongodb')

async function main() {
  try {
    const userId = "664dc69e915dfbd05facd7c9";
    const user = await getUserById(userId);
    console.log("User:", user);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
main().catch(console.error);
