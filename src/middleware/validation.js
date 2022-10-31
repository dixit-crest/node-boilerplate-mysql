const { sendResponse } = require("../utils/helpers");

const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((_) => _.message).join(", ");

      // console.log("error", message);
      res.status(422).json(sendResponse(null, 422, message));
    }
  };
};
module.exports = validation;
