const { getUserById } = require("../utils/userUtils");

async function main() {
  try {
    const userId = "664b15334e1f1eb9edc1baf4";
    const user = await getUserById(userId);
    console.log("User:", user);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
main().catch(console.error);
