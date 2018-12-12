const Promise = require("bluebird");

exports.getUserDetails = getUserDetails;
exports.createUser = createUser;

function getUserDetails(email) {
    return new Promise((resolve, reject)=>{
        let sql = "select * from `tb_users` where email= ?";
        connection.query(sql,[email], function (err, result) {
            if(err)
                reject(err)
            resolve(result);
        })
    })
}

function createUser(opts) {
    return new Promise((resolve, reject)=>{
        let sql = "Insert into tb_users (`name`,`email`, `password`) values ?";
        let values = [opts.name, opts.email, opts.password];
        connection.query(sql, [values], function (err, result) {
            if(err)
                reject(err)
            resolve(result);
        })
    })
}
