const express = require("express");
const authorRoutes = express.Router();
const controller = require("../controller/authorController");
const authentication = require("../middleware/auth");

authorRoutes.get("/", (req, res) => {
  console.log("hello world");
  res.send("hello");
});

authorRoutes.post("/signup", controller.registerAuthor);
authorRoutes.post("/login", controller.loginAuthor);
authorRoutes.post("/logout", controller.logoutAuthor);
authorRoutes.get("/author/me", authentication, controller.authorDetails);
// author details...
authorRoutes.get("/authors", controller.authors);
// all authors in DB with number of books published .
authorRoutes.get("/author/:id", authentication, controller.getAuthorBooks);
// particular details of author with list if books if author

module.exports = authorRoutes;
