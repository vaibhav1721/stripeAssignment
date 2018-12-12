let Promise = require('bluebird');
let _ = require('underscore');
let config = require('config');
let stripe = require('stripe');


let response = require('../../../services/response');
let userServices = require('../../user/userServices/userService');
let stripeService =  require('../stripeServices/stripeService');
let bookingService = require('../../booking/bookingService/bookingServices');

exports.chargeFromStripe = chargeFromStripe;
exports.registerUserToStripe = registerUserToStripe;
exports.getUserStripeDetails = getUserStripeDetails;

function chargeFromStripe(req,res) {
    Promise.coroutine(function *() {
        let card_number           = req.body.card_number;
        let exp_month             = req.body.exp_month;
        let exp_year              = req.body.exp_year;
        let user_id               = req.body.user_id;
        let marketplace_user_id   = req.body.marketplace_user_id;
        let amount                = req.body.amount;
        let job_id                = req.body.job_id;
        let cvc                   = req.body.cvc;
        let email                 = req.body.email;
        let connectionObj  = yield connection.getConnectionForTransaction();


        let userDetails=  yield userServices.getUserDetails(email);
        if(_.isEmpty(userDetails)){
            return response.invalidUser(res);
        }
        yield connection.beginTransaction(connectionObj);

        let stripeTokenOtps = {
            card_number  : card_number,
            exp_month    : exp_month,
            exp_year     : exp_year,
            cvc          : cvc
        };
        let tokenId  = yield stripeService.getToken(stripeTokenOtps,config.get("stripeKey.privateKey"));

        let chargeOpts= {
            amount  : amount,
            token   : tokenId,
            email   : email
        };
        let chargeDetails  = yield stripeService.createCharge(chargeOpts,config.get("stripeKey.secretKey"));

        yield bookingService.insertBookingDetails(connectionObj, {job_id: job_id, amount: amount, user_id: user_id, charge_id : chargeDetails.id});

        yield connection.commitTransaction(connectionObj);

        return response.paymentSuccess(res, {id : chargeDetails.id});
    }).then((result)=>{
        console.log(result);
    },(error)=>{
        connection.rollbacktransaction(connectionInnstance);
        return response.sendError(res);
    });

}

function registerUserToStripe(req,res) {
    Promise.coroutine(function *() {
        let user_id                       = req.body.user_id;
        let merchant_id          = req.body.merchant_id;

        let city                          = req.body.city;
        let line1                         = req.body.line1;
        let first_name                    = req.body.first_name;
        let last_name                     = req.body.last_name;
        let line2                         = req.body.line2;
        let personal_postal_code          = req.body.personal_postal_code;
        let state                         = req.body.state;
        let dob_day                       = req.body.dob_day;
        let dob_month                     = req.body.dob_month;
        let dob_year                      = req.body.dob_year;
        let bank_account_country          = req.body.bank_account_country;
        let bank_account_currency         = req.body.bank_account_currency;
        let bank_account_number           = req.body.bank_account_number;
        let country                       = req.body.country;
        let routing_number                = req.body.routing_number;
        let bank_account_type             = req.body.bank_account_type;        // individual or company
        let ip                            = req.body.ip || "167.99.93.3" ;
        let ssn                           = req.body.ssn;
        ip = JSON.parse(ip);
        let stripe_creds ={
            object          : "bank_account",
            country         : bank_account_country,
            currency        : bank_account_currency,
            account_number  : bank_account_number
        };
        if(routing_number) {
            stripe_creds.routing_number = routing_number;
        }
        let legalEntityOfStripe = {
            dob   : {
                day          : dob_day,
                month        : dob_month,
                year         : dob_year
            },
            first_name       : first_name,
            last_name        : last_name,
            type             : bank_account_type
            address : {
                state       : state,
                city        : city,
                line1       : line1,
                postal_code : personal_postal_code
            },
        }
        if(line2){
            legalEntityOfStripe.address.line2 = line2;
        }
        legalEntityOfStripe.ssn_last_4  = ssn.slice(ssn.toString().length-4 ,ssn.toString().length);

        let getConnection  = yield connection.getConnectionForTransaction();

        yield connection.beginTransaction(getConnection);

        let result  = yield stripeService.getStripeAccDetails(getConnection,user_id);

        if(!_.isEmpty(result)){
            return response.userAlreadyExist(res);
        }

        let stripeKey = stripe(config.get("stripeKey.privateKey"));

        let accountDetails = yield stripeKey.accounts.create({
            country         : country,
            type            : "custom",
            tos_acceptance  : {
                date : Math.floor(Date.now() / 1000),
                ip   : ip
            },
            debit_negative_balances : true,
            legal_entity : legalEntityOfStripe,

            payout_schedule : {
                delay_days  : 2,
                interval    : "daily"
            },
            metadata : {
                account_type         : "merchant",
                user_id              : user_id
            },
            external_account  : stripe_creds
        });

        let accountStatus = accountDetails.legal_entity.verification.status;
        if(accountStatus != "pending" || accountStatus != "verified" || accountStatus != "unverified"){
            return response.sendError(res);
        }
        let insertOpts = {
            values :[
                [user_id,
                    accountDetails.id,
                    accountStatus,
                    bank_account_currency,
                    JSON.stringify(accountDetails)]
            ]
        }

        yield stripeService.insertAccDetails(getConnection, insertOpts);
        yield connection.commitTransaction(getConnection);

        return response.accountAddedToStripe(res);

    }).then((result)=>{
        console.log(result);
    },(error)=>{
        connection.rollbacktransaction(connectionInnstance);
        return response.sendError(res);
    });
}

function getUserStripeDetails(req, res) {
    Promise.coroutine(function *() {
        let user_id = req.body.user_id;
        let merchant_id = req.body.merchant_id;
        let getConnection = yield connection.getConnectionForTransaction();
        yield connection.beginTransaction(getConnection);

        let accDetails = yield stripeService.getStripeAccDetails(getConnection, user_id);

        if(_.isEmpty(accDetails)){
            return response.invalidUser(res);
        }
        let stripe_account_number = acc_data[0]['stripe_account_number'];
        let stripeKeys = config.get("stripeKeys.privateKey");
        let accountDetails = yield stripe.accounts.retrieve(stripe_account_number);

        let accountStatus = accountDetails.legal_entity.verification.status;
        if(accountStatus != "pending" || accountStatus != "verified" || accountStatus != "unverified"){
            return response.sendError(res);
        }

        if(acc_details.legal_entity.verification.status != acc_data[0]['account_status']) {
            let opts    = {
                account_status : accountStatus,
                where   :{
                    user_id : user_id }
            };
            yield stripeService.updateStripeAccDetails(opts,getConnection);
        }

        return response.sendSuccessResponse(res,JSON.stringify(accountDetails));

    }).then((result)=>{
        console.log(result);
    },(error)=>{
        connection.rollbacktransaction(connectionInnstance);
        return response.sendError(res);
    });
}
