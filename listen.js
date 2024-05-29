const app = require("./app");
const { PORT = 9090 } = process.env;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  // Exit the process after the server has started listening
  process.exit();
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1); // Exit with non-zero status code on error
});
