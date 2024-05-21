const {getTaskById} = require("../utils/taskUtils");

async function run() {
  await getTaskById("234");
}

run().catch(console.error);
