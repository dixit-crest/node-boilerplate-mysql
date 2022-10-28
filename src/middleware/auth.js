const jwt = require("jsonwebtoken");
const { UNAUTHORIZED, UNAUTHORIZE_ERROR } = require("../utils/constants");
const { JWT_SECRET } = require("../utils/envVars");
const { sendResponse } = require("../utils/helpers");
const Models = require("../models");

// (...roles) =>
module.exports = async (req, res, next) => {
  try {
    const token =
      req.headers["x-access-token"] ||
      req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(UNAUTHORIZED)
        .json(sendResponse(null, UNAUTHORIZED, UNAUTHORIZE_ERROR));
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    // if (roles.includes(Number(decoded.role)))
    //   return res
    //     .status(UNAUTHORIZED)
    //     .json(sendResponse(null, UNAUTHORIZED, NOT_AUTHORIZED));

    const user = await Models.Users.findOne({
      where: { email: decoded.email },
    });

    if (user.toJSON().token !== token)
      return res
        .status(UNAUTHORIZED)
        .json(
          sendResponse(null, UNAUTHORIZED, "Session expired, Please re-login")
        );
    next();
  } catch (err) {
    console.log(":: err :: ", err);
    return res
      .status(UNAUTHORIZED)
      .json(
        sendResponse(null, UNAUTHORIZED, "Session expired, Please re-login")
      );
  }
};
