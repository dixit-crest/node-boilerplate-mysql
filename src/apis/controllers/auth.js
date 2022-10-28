const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const {
  RECORD_CREATED,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  USER_TYPES,
  CREATED,
  SERVER_ERROR,
  OK,
  RECORDS_FOUND,
  INVALID_CREDENTIALS,
  JWT_SECRET,
  JWT_EXPIRESIN,
} = require("../../utils/constants");

const Models = require("../../models");
const emailChacker = require("deep-email-validator");
const { sendResponse } = require("../../utils/helpers");

exports.signup = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!(email && password && firstName && lastName)) {
      return res
        .status(400)
        .json(sendResponse(null, 400, "Please provide email and password"));
    }

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
      role: userObj.role || USER_TYPES.ADMIN,
    });
    let token = jwt.sign(
      {
        id: createdUser.dataValues.id,
        email: createdUser.dataValues.email,
        role: USER_TYPES.ADMIN,
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
      code: CREATED,
      message: RECORD_CREATED,
    });
  } catch (error) {
    console.log(
      "\n",
      "Following error occured in : ",
      __filename,
      "\n\n",
      error
    );
    return res.status(500).json(sendResponse(null, 500, SERVER_ERROR));
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check empty request body
    if (!(email && password)) {
      return res
        .status(400)
        .json(sendResponse(null, 400, "Please provide email and password"));
    }
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
