// patchUserTest.js
const { patchUser } = require("../utils/userUtils");

async function testPatchUser() {
  try {
    const userIDToUpdate = "664df1ad420d6a81f02b9d28";
    const updatedFields = {
      username: "This is an update!",
      email: "patchtest@user.com",
      fullName: "Tamya Hussain",
    };
    await patchUser(userIDToUpdate, updatedFields);
    console.log(`User with ID ${userIDToUpdate} patched/updated successfully`);
  } catch (error) {
    console.error("Error patching/updating task:", error);
  }
}
testPatchUser().catch(console.error);