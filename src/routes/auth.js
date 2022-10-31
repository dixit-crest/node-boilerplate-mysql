const moduleRoute = require("express").Router();
const controller = require("../controllers/auth");
const validation = require("../middleware/validation");
const {
  signinSchema,
  signupSchema,
  reqResetPasswordSchema,
  resetPasswordSchema,
} = require("../validations/auth");

moduleRoute.route("/signup").post(validation(signupSchema), controller.signup);

moduleRoute.route("/signin").post(validation(signinSchema), controller.signin);

moduleRoute
  .route("/request-reset-password")
  .post(validation(reqResetPasswordSchema), controller.reqestResetPasswords);

moduleRoute
  .route("/reset-password")
  .post(validation(resetPasswordSchema), controller.resetPassword);

module.exports = moduleRoute;
