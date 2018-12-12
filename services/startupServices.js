const apiReferenceModule                          = "startup";

const Promise                                     = require('bluebird');
const envDetails                                  = require('./../properties/environmentDetails');
const MongoClient                                 = require('mongodb').MongoClient;
const http                                        = require('http');
const mysqlLib                                    = require('../services/mysqlService');
exports.initializeServer                          = initializeServer;


function initializeServer() {
    return new Promise((resolve,reject)=>{
        let currentApi = {
            module: apiReferenceModule,
            api: 'initializeServer'
        }
        Promise.coroutine(function* () {
            let mongoConnect= yield initializeMongoConnectionPool(envDetails.databaseSettings.mongo.connectionString, { poolSize: 20, useNewUrlParser: true });
            global.db = mongoConnect;
            let mysqlConnect = yield mysqlLib.initializeConnection(envDetails.databaseSettings.mysql.master);
            const server = yield startHttpServer(envDetails.port);
        })().then((data) => {
            resolve(data);
        }, (error) => {
            reject(error);
        });
    })
}

function initializeMongoConnectionPool(config, opts) {
    return new Promise((resolve,reject)=>{
        MongoClient.connect(config,opts, function (err, result) {
            if(err){
                console.log("Error connecting Mongo Database");
                reject(err)
            }
            console.log("########## Mongo Connected ##########");
            const dbo = result.db('assignment')
            resolve(dbo);
        })
    })
}

function startHttpServer(port) {
    return new Promise((resolve,reject) => {
        console.log("asdasd",);
        var server = http.createServer(app).listen(port, function (err, result) {
            if(err)
                reject(err);
            console.error("###################### Express connected ##################", port, app.get('env'));
            resolve(server);
        });
    });
}
