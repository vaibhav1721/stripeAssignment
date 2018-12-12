let Promise = require('bluebird');
let mysqlConn = require('../../../services/mysqlService');

exports.insertBookingDetails = insertBookingDetails;

function insertBookingDetails(connectionObj, options) {
    return new Promise((resolve,reject)=>{
        let sql = "INSERT INTO tb_payment_details (job_id,user_id,amount,charge_id) VALUES(?,?,?,?)";

        dbHandler.executeTransaction(sql,options.values,connectionObj).then((result)=>{
            return resolve();
        }).catch((error)=>{
            dbHandler.rollbacktransaction(connectionObj).then(()=>{
                return reject(error);
            }).catch((err)=>{
                return reject(err);
            });

        });
    });
}
