const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json()); // Line added for POST functionnality > middleware

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

// requires from auth for Password and Route security
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

// movies part
const movieHandlers = require("./movieHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

// movie POST part
// app.post("/api/movies", movieHandlers.postMovie);

// VALIDATOR MOVIE
const { validateMovie, validateUser } = require("./validators.js");

// ------------------------------------------------------------

// users part
const userHandlers = require("./userHandlers");

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

// user POST part we also get verifyPassword for login route, in a DRY way

app.post("/api/users", hashPassword, userHandlers.postUser);

// Login routes

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

// PROTECTED ROUTES

app.use(verifyToken); // authentification wall > will verify token for all the routes after

// movie POST part
app.post("/api/movies", validateMovie, movieHandlers.postMovie);

// movie UPDATE part
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);

// movie DELETE part
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

// user UPDATE part
app.put("/api/users/:id", validateUser, userHandlers.updateUser);

// user DELETE part
app.delete("/api/users/:id", userHandlers.deleteUser);

//listen
app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
