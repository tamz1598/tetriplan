const addUser = require("../utils/addUser");

async function testAddUser() {
  try {
    const userID = "1";
    const username = "gam";
    const email = "g@jack.com";

    const newUser = await addUser(userID, username, email);
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

testAddUser().catch(console.error);
