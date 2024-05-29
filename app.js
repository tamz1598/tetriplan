require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const { getAllTasks, addTask, getTaskById, getAllTasksByUserId, patchTask, deleteTaskById } = require("./utils/taskUtils");

const { getAllUsers, getUserById, addUser, patchUser, deleteUserById } = require('./utils/userUtils')

const taskController = require('./controller/taskController');
const { getRecommendedTasks } = require('./controller/taskController');

const endpoints = require('./endpoints.json');

const app = express();

app.use(cors());
//read json data  
app.use(express.json());

mongoose.set("strictQuery", false);

// environment variables, due to the connection string using MONGODB-X509 for authentication rather than hard coding it in.


if (!process.env.MONGODB_CONNECT_URI) {
  throw new Error("MONGODB_CONNECT_URI environment variable is not set");
}

//connect to mongoose
mongoose
  .connect(process.env.MONGODB_CONNECT_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const router = express.Router();

// routers
app.get('/api', (req, res) => {
  res.status(200).send({ endpoints });
});

router.get("/api/users", getAllUsers) //done

router.get("/api/users/:username", getUserById) //done

router.post("/api/users/:username", addUser) //done

router.patch("/api/users/:username", patchUser) //done

router.delete("/api/users/:username", deleteUserById)

router.get("/api/tasks", getAllTasks) //done

router.get("/api/tasks/:taskID", getTaskById) //done

router.patch("/api/tasks/:taskID", patchTask) //done 

router.delete("/api/tasks/:taskID", deleteTaskById) //done

router.post("/api/users/:username/tasks", taskController.addTask) //done

router.get("/api/users/:username/tasks", getAllTasksByUserId) //done

router.get('/api/users/:username/recommended-tasks', getRecommendedTasks);



app.use("/", router);

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
