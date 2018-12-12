let Joi = require('joi');
let validator = require('./../../../validator/validator');

exports.chargeFromStripe = chargeFromStripe
exports.registerUserToStripe = registerUserToStripe;
exports.getUserStripeDetails = getUserStripeDetails;

function chargeFromStripe(req,res, next) {
    let schema = Joi.object().keys({
        job_id              : Joi.number().required(),
        card_number         : Joi.string().required(),
        cvc                 : Joi.string().required(),
        user_id             : Joi.number().required(),
        amount              : Joi.number().required(),
        exp_month           : Joi.string().required(),
        exp_year            : Joi.string().required(),
        marketplace_user_id : Joi.number().required(),
        email               : Joi.string().required(),
    });
   let isValid =  validator.validateFields("ChargeFromStrip", req, res, schema);
    if(isValid){
        next();
    }
}

function registerUserToStripe(req, res,next) {
    let schema = Joi.object().keys({
        bank_account_type     : Joi.array().required(),
        user_id               : Joi.number().required(),
        merchant_id           : Joi.number().required(),
        city                  : Joi.string().required(),
        line1                 : Joi.string().required(),
        line2                 : Joi.string().optional(),
        personal_postal_code  : Joi.string().required(),
        bank_account_currency : Joi.string().required(),
        bank_account_country  : Joi.string().required(),
        bank_account_number   : Joi.string().required(),
        routing_number        : Joi.string().required()
        dob_day               : Joi.number().required(),
        dob_month             : Joi.number().required(),
        dob_year              : Joi.number().required(),
        first_name            : Joi.string().required(),
        last_name             : Joi.string().required(),
        ssn                   : Joi.string().required(),
        ip                    : Joi.string().required(),
        country               : Joi.string().required(),
        state                 : Joi.string().required(),
        bank_name             : Joi.string().required(),
        branch_name           : Joi.string().required(),
        phone_no              : Joi.string().required(),
    })
    let isValid = validator.validateFields("registerUserToStripe", req, res, schema);
    if(isValid)
        next()
}

function getUserStripeDetails(req,res, next) {
    let schema = Joi.object().keys({
        user_id : Joi.number().required(),
        merchant_id : Joi.number.required()
    })

    let isValid = validator.validateFields("getUserStripeDetails", req, res, schema);
    if(isValid){
        next();
    }
}
