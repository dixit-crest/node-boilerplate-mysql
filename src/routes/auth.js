const moduleRoute = require("express").Router();
const controller = require("../controllers/auth");
const validation = require("../middleware/validation");
const {
  signinSchema,
  signupSchema,
  reqResetPasswordSchema,
  resetPasswordSchema,
} = require("../validations/auth");

/**
 * method: `POST`
 * 
 * url: `http://localhost:3001/api/v1/auth/signup`
 */
moduleRoute.route("/signup").post(validation(signupSchema), controller.signup);

/**
 * method: `POST`
 * 
 * url: `http://localhost:3001/api/v1/auth/signin`
 */
moduleRoute.route("/signin").post(validation(signinSchema), controller.signin);

/**
 * method: `POST`
 * 
 * url: `http://localhost:3001/api/v1/auth/request-reset-password`
 */
moduleRoute
  .route("/request-reset-password")
  .post(validation(reqResetPasswordSchema), controller.reqestResetPasswords);

/**
 * method: `POST`
 * 
 * url: `http://localhost:3001/api/v1/auth/reset-password`
 */
moduleRoute
  .route("/reset-password")
  .post(validation(resetPasswordSchema), controller.resetPassword);

module.exports = moduleRoute;
