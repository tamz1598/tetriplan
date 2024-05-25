const {getAllTasksByUserId} = require("../utils/taskUtils");
async function run() {
  const userID = "1";
  const tasks = await getAllTasksByUserId(userID);
}
run();
