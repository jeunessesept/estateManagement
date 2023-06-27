const Joi = require('joi')



const validate = (schema) => (req, res, next) => {
    const propertiesToValidate = Object.keys(schema);

    const errors = [];
    for (const property of propertiesToValidate) {
      const validationResult = schema[property].validate(req[property]);
      if (validationResult.error) {
        errors.push(validationResult.error.details.map((detail) => detail.message).join(', '));
      }
    }
    if (errors.length > 0) {
      const errorMessage = errors.join(', ');
      const err = new Error(errorMessage);
      err.statusCode = 400;
      return next(err);
    }
  
    return next();
   
}

module.exports = validate



