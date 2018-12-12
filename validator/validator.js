const Joi                                         = require('joi');
const responses                                   = require('../utills/response');

exports.validateFields = function (apiReference, req, res, schema) {
    logging.log(apiReference, {REQUEST_BODY: req});
    let validation = Joi.validate(req, schema);
    if(validation.error) {
        let errorReason =
            validation.error.details !== undefined
                ? validation.error.details[0].message
                : 'Parameter missing or parameter type is wrong';
        // if(!_.isEmpty(validation.error.details)){
        //     errorReason = {
        //         validation_error : validation.error.details[0].message,
        //         path             : validation.error.details[0].path
        //     }
        // } else {
        //     errorReason = {
        //         validation_error : "Parameter missing or parameter type is wrong"
        //     }
        // }
        responses.sendResponse(res,errorReason, constants.responseFlags.PARAMETER_MISSING_IN_REQUEST);
        return false;
    }
    return true;
};
