const { RECORD_FOUND } = require("./constants");

/**
 * Function to send json data to user with specific format.
 * 
 * @param {any} data - Data to send in response 
 * @param {HttpCode} code - Http response code 
 * @param {String} message - Message for the response 
 * @returns 
 */
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