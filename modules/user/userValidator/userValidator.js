const Joi = require('joi');

const validate = require('../../../validator/validator');

exports.createUser = createUser;

function createUser(req, res, next) {
    let schema = {
        name : Joi.string().required(),
        email : Joi.string().email().required(),
        password : Joi.string().required(),

    }
    let isValid = validate.validateFields("createUser", req, res, schema);
    if(isValid)
        next()
}
