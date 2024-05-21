const deleteUserById = require("../utils/deleteUser");

async function testDeleteUser() {
  try {
    const userIDToDelete = "1";
    await deleteUserById(userIDToDelete);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

testDeleteUser().catch(console.error);
