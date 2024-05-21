const getUserById = require("../utils/getUserById");

async function main() {
  try {
    const userId = "124124";
    const user = await getUserById(userId);
    console.log("User:", user);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
main().catch(console.error);
