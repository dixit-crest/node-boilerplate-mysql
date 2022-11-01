const Joi = require("joi");

module.exports = {
  notesSchema: Joi.object({
    title: Joi.string().required(),
    content: Joi.string(),
  }),
};
