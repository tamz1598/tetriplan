// main.js
const getAllUsers = require("../utils/getAllUsers");

async function main() {
  try {
    const users = await getAllUsers();
    console.log("All Users:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Execute the main function
main().catch(console.error);
