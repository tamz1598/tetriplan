const { getTaskById } = require("../utils/taskUtils");

async function run() {
  await getTaskById("6649fcd20578065fb77505ee");
}

run().catch(console.error);
