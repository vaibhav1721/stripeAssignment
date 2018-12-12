let Promise                        = require('bluebird');
let _                              = require('underscore');
const stripeVar                    = require('stripe');

let dbHandler                      = require('../connection/mysql');

exports.getStripeKeys = getStripeKeys;
exports.getToken      = getToken;
exports.createCharge      = createCharge;
exports.getStripeAccDetails      = getStripeAccDetails;
exports.insertAccDetails      = insertAccDetails;
exports.updateStripeAccDetails      = updateStripeAccDetails;

function getStripeKeys(connectionObj,user_id){
    return new Promise((resolve,reject)=>{
        let sql  = "SELECT * FROM tb_stripe_keys WHERE user_id =? "
        let params=[user_id];

        dbHandler.executeTransaction(sql,params,connectionObj)
            .then((result)=>{
                return resolve(result);
            }) .catch((err)=>{
            dbHandler.rollbacktransaction(connectionObj).then(()=>{
                return reject(err);
            }) .catch((error)=>{
                return reject(error);
            })
        })
    })
}

function getToken(opts,stripeKeys){
    return new Promise((resolve, reject)=>{
        let stripe = stripeVar(stripeKeys);
        stripe.tokens.create({
            card: {
                "number"    : opts.card_number,
                "exp_month" : opts.exp_month,
                "exp_year"  : opts.exp_year,
                "cvc"       : opts.cvc
            }
        },function(err, token){
            if(err){
                return reject(err.message);
            }
            return resolve(token.id);
        });
    });
}
function createCharge(opts,stripeKeys){
    return new Promise((resolve,reject)=>{
        let stripe = stripeVar(stripeKeys);

        stripe.charges.create({
            amount : opts.amount *100,
            currency : "usd",
            source : opts.token,
            descripton : `charge for ${opts.email}`
        },function(err,charge){
            if(err){
                return reject(err.message);
            }
            return resolve(charge);
        })
    })
}

function getStripeAccDetails(connectionObj,user_id){
    return new Promise((resolve,reject)=>{
        let sql = "SELECT * FROM tb_stripe_details WHERE user_id=? "
        dbHandler.executeTransaction(sql,[user_id], connectionObj).
        then((result)=>{
            return resolve(result);
        }) .catch((err)=>{
            dbHandler.rollbacktransaction(connectionObj).then(()=>{
                return reject(err);
            }) .catch((error)=>{
                return reject(error);
            });
        })
    })
}
function updateStripeAccDetails(connectionObj, opts){
    return new Promise((resolve,reject)=>{
        let sql ="UPDATE tb_stripe_account_details SET account_status=?  WHERE user_id=? "
        let params=[opts.account_status,opts.where.user_id];

        if (opts.where.hasOwnProperty('stripe_account_number')) {
            sql += " AND stripe_account_number = ? ";
            params.push(opts.where.stripe_account_number);
        }
        dbHandler.executeTransaction(sql, params, connectionObj).then((result)=>{
            return resolve();
        }) .catch((ex)=>{
            return reject(ex);
        })
    })
}

function insertAccDetails(connectionObj,opts){
    return new Promise((resolve,reject)=>{
        let sql =" INSERT INTO tb_stripe_details(user_id, stripe_acc_n0, acc_status, currency, stripe_acc_details) VALUES(?,?,?,?,?)";

        dbHandler.executeTransaction(sql,opts.values,connectionObj).then((result)=>{
            return resolve(result);
        }) .catch((ex)=>{
            dbHandler.rollbacktransaction(connectionObj).then(()=>{
                return reject(ex);
            }) .catch((error)=>{
                return reject(error);
            })

        })
    });
}
