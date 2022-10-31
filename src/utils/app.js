const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/v1", require("../routes"));

module.exports = app;
