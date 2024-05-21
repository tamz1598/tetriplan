# Tetriplan Backend

This is the backend component of the Tetriplan application. It provides the server-side logic and interacts with the database to handle user data.

## Features

- Connects to MongoDB Atlas cluster to store user data.
- Allows inserting new users into the database.
- Provides an example of inserting and finding users using the MongoDB Node.js driver.

## Prerequisites

Before running the backend server, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB Atlas account (or a local MongoDB instance)

## Getting Started

1. Clone this repository to your local machine.
2. Navigate to your project directory in the terminal or command prompt.
3. Run `npm install` to install project dependencies.
4. Update the MongoDB connection string in `app.js` to match your MongoDB Atlas cluster or local MongoDB instance.
5. Run the backend server using `node app.js`.

## Configuration

You need to update the MongoDB connection string in `app.js` to connect to your MongoDB Atlas cluster or local MongoDB instance.

## Adding Dependencies

To add dependencies to your project, use `npm` (Node Package Manager). For example, to install the MongoDB Node.js driver, run:

