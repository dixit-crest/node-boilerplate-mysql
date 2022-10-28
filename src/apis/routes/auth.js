const moduleRoute = require("express").Router();
const controller = require("../controllers/auth");

moduleRoute.route("/signup").post(controller.signup);

moduleRoute.route("/signin").post(controller.signin);

module.exports = moduleRoute;
