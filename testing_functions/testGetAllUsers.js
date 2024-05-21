const { getAllUsers } = require("../utils/userUtils");

async function main() {
  try {
    const users = await getAllUsers();
    console.log("All Users:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

main().catch(console.error);
