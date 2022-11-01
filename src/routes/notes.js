const moduleRoute = require("express").Router();
const controller = require("../controllers/notes");
const auth = require("../middleware/auth");
const validation = require("../middleware/validation");
const { notesSchema } = require("../validations/notes");

moduleRoute.route("/").post([auth, validation(notesSchema)], controller.createNote);
moduleRoute.route("/").get([auth], controller.getUsersNotes);
moduleRoute.route("/all").get([auth], controller.getAllNotes);
moduleRoute.route("/:id").delete([auth], controller.deleteNote);
moduleRoute.route("/:id").put([auth, validation(notesSchema)], controller.editNote);

module.exports = moduleRoute;
