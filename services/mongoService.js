const Promise                   = require('bluebird');

exports.mongoInsert             = mongoInsert;
exports.mongoEdit               = mongoEdit;
exports.mongoDelete             = mongoDelete;
exports.mongoFind               = mongoFind;

function mongoInsert(apiReference,opts) {
    return new Promise((resolve, reject) =>{
        db.collection(opts.collectionName).insertOne(opts.insertObj).next(function (err, result) {
            console.log("result of " + apiReference + " : >>>>> " + err ,result);
            if(err)
                reject(err);
            resolve(result);
        })
    })
}

function mongoFind(apiReference, opts) {
    return new Promise((resolve, reject) => {
        db.collection(opts.collectionName).find(opts.findObj).next(function (err, result) {
            console.log("result of " + apiReference + " : >>>>> " + err, result);
            if (err)
                reject(err)
            resolve(result);
        })
    })
}

function mongoEdit(apiReference, opts) {
    return new Promise((resolve, reject) => {
        db.collection(opts.collectionName).updateOne(opts.query , {$set : opts.updateData}).next(function (err, result) {
            console.log("result of " + apiReference + " : >>>>> " + err, result);
            if(err)
                reject(err)
            resolve(result);
        })
    })
}


function mongoDelete(apiReference, opts) {
    return new Promise((resolve, reject)=>{
        db.collection(opts.collectionName).deleteOne(opts.deleteObj).next(function (err, result) {
            if(err)
                reject(err)
            resolve(result)
        })
    })
}
