const { deleteUserById } = require("../utils/userUtils");

async function testDeleteUser() {
  try {
    const userIDToDelete = "124124";
    await deleteUserById(userIDToDelete);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

testDeleteUser().catch(console.error);
