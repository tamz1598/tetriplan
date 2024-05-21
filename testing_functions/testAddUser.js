const { addUser } = require("../utils/userUtils");

async function testAddUser() {
  try {
    const username = "jck";
    const email = "testing2@jack.com";
    const fullName = "Jack Davenport";

    const newUser = await addUser(username, email, fullName);
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

testAddUser().catch(console.error);
