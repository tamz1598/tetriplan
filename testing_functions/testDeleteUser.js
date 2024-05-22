const { deleteUserById } = require("../utils/userUtils");

async function testDeleteUser() {
  try {
    const userIDToDelete = "664df1ad420d6a81f02b9d28";
    await deleteUserById(userIDToDelete);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

testDeleteUser().catch(console.error);
