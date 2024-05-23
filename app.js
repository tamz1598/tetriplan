require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");

const { getAllTasks, addTask, getTaskById, getAllTasksById, getAllTasksByIdAndCategory, getTasksByIdSortedByDate, getAllTasksByIdAndPriority, patchTask, deleteTaskById } = require("./utils/taskUtils");

const { getAllUsers, getUserById, addUser, patchUser, deleteUserById } = require('./utils/userUtils')

const app = express();


//read json data  
app.use(express.json());

mongoose.set("strictQuery", false);

// environment variables, due to the connection string using MONGODB-X509 for authentication rather than hard coding it in.
const mongoUri = process.env.MONGODB_CONNECT_URI

if (!mongoUri) {
  throw new Error("MONGODB_CONNECT_URI environment variable is not set");
}

//connect to mongoose
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const router = express.Router();

// routers
router.get("/tasks", getAllTasks)

router.post("/tasks", addTask)

router.get("/tasks/:taskID", getTaskById)

router.get("/tasks/:userID", getAllTasksById)

router.get("/tasks/:userID/:category", getAllTasksByIdAndCategory)

router.get("/tasks/:userID", getTasksByIdSortedByDate)

router.get("/tasks/:userID", getAllTasksByIdAndPriority)

router.patch("/tasks/:taskId", patchTask)

router.delete("/tasks/:taskId",deleteTaskById)

router.get("/users", getAllUsers)

router.get("/users/:userID", getUserById)

router.post("/users/", addUser)

router.patch("/users/userID", patchUser)

router.delete("/users/userID", deleteUserById)

//error handling
app.all("*", (request, response, next) => {
  response.status(404).send({ message: "endpoint not found" });
});

app.use((err, request, response, next) => {
  if (err.status && err.message)
    response.status(err.status).send({ message: err.message });
  next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ message: "internal server error" });
});


module.exports = app;
