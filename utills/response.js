
const constants                         = require('../utills/constant');

exports.sendResponse                    = sendResponse;
exports.somethingWentWrongError         = somethingWentWrongError;

function sendResponse(res, msg, status, data, values) {
    let response = {
        message: msg,
        status : status,
        data   : data || {}
    };
    if(values){
        response.values = values;
    }
    res.send(JSON.stringify(response));
}

function somethingWentWrongError(res) {
    let response = {
        message: constants.responseMessage.SOMETHING_WENT_WRONG
        status: constants.responseFlags.SOMETHING_WENT_WRONG,
        data : {}
    }
    res.send(JSON.stringify(response));
}
