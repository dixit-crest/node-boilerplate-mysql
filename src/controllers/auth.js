const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const {
  RECORD_CREATED,
  INTERNAL_SERVER_ERROR,
  USER_TYPES,
  SERVER_ERROR,
  OK,
  RECORDS_FOUND,
  INVALID_CREDENTIALS,
  JWT_SECRET,
  JWT_EXPIRESIN,
} = require("../utils/constants");

const Models = require("../models");
const emailChacker = require("deep-email-validator");
const { sendResponse } = require("../utils/helpers");
const { sendResetPasswordEmail } = require("../services/email/users");
const logger = require("../logs/logger");

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // not allowing someone to create new SUPER_ADMIN
    if (req.body.role && Number(req.body.role) === USER_TYPES.SUPER_ADMIN) {
      return res
        .status(400)
        .json(sendResponse(null, 400, "Invalid request, Please try again"));
    }

    // is valid email
    const validationEmail = await emailChacker.validate({
      email,
      validateSMTP: false,
    });

    if (!validationEmail.valid) {
      return res
        .status(400)
        .json(
          sendResponse(
            null,
            400,
            "Invalid email, Please check your email and try again."
          )
        );
    }

    // if user already exists
    const user = await Models.Users.findOne({ where: { email } });
    if (user) {
      return res
        .status(400)
        .json(
          sendResponse(null, 400, "Account with this email already exists.")
        );
    }

    const userObj = { ...req.body };

    userObj.password = bcryptjs.hashSync(password, 8);

    const createdUser = await Models.Users.create({
      ...userObj,
      role: userObj.role || USER_TYPES.CUSTOMER,
    });
    let token = jwt.sign(
      {
        id: createdUser.dataValues.id,
        email: createdUser.dataValues.email,
        role: userObj.role || USER_TYPES.CUSTOMER,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRESIN,
      }
    );

    await Models.Users.update(
      { token: token },
      {
        where: {
          id: createdUser.dataValues.id,
        },
      }
    );
    res.user = createdUser;

    res.status(201).json({
      data: {
        user: { ...createdUser.dataValues, token },
      },
      code: 201,
      message: RECORD_CREATED,
    });
  } catch (error) {
    logger.error('Whooops! This broke with error: ', error);
    return res.status(500).json(sendResponse(null, 500, SERVER_ERROR));
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Models.Users.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json(sendResponse(null, 400, INVALID_CREDENTIALS));
    }

    if (user && user.dataValues) {
      let isPasswordValid = await bcryptjs.compare(
        password,
        user.dataValues.password
      );
      if (!isPasswordValid)
        return res
          .status(400)
          .json(sendResponse(null, 400, INVALID_CREDENTIALS));
      let token = jwt.sign(
        {
          id: user.dataValues.id,
          email: user.dataValues.email,
          role: user.dataValues.role,
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRESIN,
        }
      );

      await Models.Users.update(
        { token: token },
        {
          where: {
            id: user.dataValues.id,
          },
        }
      );

      const response = await Models.Users.findOne({
        where: { email: email },
      });

      return res.status(200).json(
        sendResponse(
          {
            ...response.toJSON(),
          },
          OK,
          RECORDS_FOUND
        )
      );
    }
  } catch (error) {
    console.log(
      "\n",
      "Following error occured in : ",
      __filename,
      "\n\n",
      error
    );
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(sendResponse(null, INTERNAL_SERVER_ERROR, SERVER_ERROR));
  }
};

exports.reqestResetPasswords = async (req, res, next) => {
  try {
    let resetPasswordToken = jwt.sign({ email: req.body.email }, JWT_SECRET, {
      expiresIn: "1days",
    });

    // if user exists or not
    const userExists = await Models.Users.findOne({
      where: { email: req.body.email },
    });

    if (!userExists) {
      return res
        .status(404)
        .json(sendResponse(null, 404, "We couldn't find your account."));
    }

    await Models.Users.update(
      { passwordToken: resetPasswordToken },
      {
        where: { email: req.body.email },
      }
    );

    sendResetPasswordEmail(userExists, resetPasswordToken);

    return res.json(
      sendResponse(null, 200, "Please check your email to reset your password.")
    );
  } catch (error) {
    console.log("  ::error:: ", error);
    return res.status(500).send(sendResponse(null, 500, SERVER_ERROR));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    let decoded = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.log("  :: err ::", err);
      return res
        .status(400)
        .json(
          sendResponse(
            null,
            400,
            "Your password reset link has been expired, Please try again."
          )
        );
    }

    const user = await Models.Users.findOne({
      where: { email: decoded.email },
    });

    if (!user) {
      return res
        .status(400)
        .json(
          sendResponse(
            null,
            400,
            "This link has been expired. Please try again"
          )
        );
    }

    if (user.dataValues.passwordToken === token) {
      let encryptedPassword = bcryptjs.hashSync(password, 8);
      await Models.Users.update(
        { passwordToken: null, password: encryptedPassword },
        { where: { email: decoded.email } }
      );
      return res
        .status(200)
        .json(sendResponse(null, 200, "Your password has been reset"));
    } else {
      return res
        .status(400)
        .json(
          sendResponse(
            null,
            400,
            "Your password reset link has been expired, Please try again."
          )
        );
    }
  } catch (error) {
    console.log("  ::error:: ", error);
    return res.status(500).json(sendResponse(null, 500, SERVER_ERROR));
  }
};
