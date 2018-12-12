let mysql                                   = require('mysql');

exports.initializeConnection = initializeConnection;
exports.rollbacktransaction          = rollbacktransaction;
exports.getConnectionForTransaction  = getConnectionForTransaction;
exports.beginTransaction             = beginTransaction;
exports.commitTransaction            = commitTransaction;
exports.executeTransaction           = executeTransaction;
exports.executeQueryPromisfy         = executeQueryPromisfy;

function initializeConnection(dbConfig) {
    return new Promise((resolve, reject)=>{
        global.connection = mysql.createConnection(dbConfig);
        connection.connect(function (err) {
            if(err)
                reject(err)
            console.log("######## MYSQL CONNECTED #############");
            resolve();
        })
    })
}


function getConnectionForTransaction(){
    return new Promise((resolve,reject)=>{
        connection.getConnection(function(err,connectionNew){
            if(err){
                connectionNew.release();
                return reject(err);
            }
            return resolve(connectionNew);
        });
    });
}

function beginTransaction(connectionObj){
    return new Promise((resolve,reject)=>{
        connectionObj.beginTransaction(function(transError){
            if(transError){
                return reject();
            }
            return resolve();
        });
    });
}

function commitTransaction(connectionObj){
    return new Promise((resolve,reject)=>{
        connectionObj.commit(function(err){
            if(err){
                rollbacktransaction(connectionObj).
                then(()=>{
                    return reject()
                }) .catch((err)=>{
                    return reject(err);
                })
            }
        })
    })
}

function rollbacktransaction(connectionObj){
    return new Promise((resolve,reject)=>{
        if(!connectionObj){
            return reject("Unable to start Transaction");
        }
        connectionObj.rollback(function(err){
            if(err){
                return reject("UNABLE TO CONNECT")
            }
            if (connection._freeConnections.indexOf(connectionObj) === -1) {
                connectionObj.release();
            }
            return resolve();
        });
    });
}

function executeTransaction(query,params,connectionObj){
    return new Promise((resolve,reject)=>{
        connectionObj.query(query, params, function(err,result){
            if(err){
                rollbacktransaction(connectionObj)
                    .then(()=>{
                        return reject(err);
                    }) .catch((err)=>{
                    return reject(err);
                })
            } else {
                return resolve(result);
            }
        });
    });
}

function executeQueryPromisfy(query, params){
    return new Promise((resolve,reject)=>{
        connection.query(query,params, function(err,result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}
