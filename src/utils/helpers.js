const { RECORD_FOUND } = require("./constants");

module.exports.sendResponse = (
    data = null,
    code = 200,
    message = RECORD_FOUND
  ) => {
    return {
      data,
      code,
      message,
    };
  };