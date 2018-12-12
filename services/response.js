
exports.invalidUser = function (res) {
    let response = {
        status : 400,
        message : "User is not registered with us",
        data :{}
    }
    res.send(JSON.stringify(response));
}

exports.paymentSuccess = function (res, data) {
    let response ={
        status : 200,
        message : " PAYMENT SUCCESSFULL ",
        data   : `YOUR ORDER_ID IS ${data.id}`
    }
    res.send(JSON.stringify(response));
}
exports.sendError = function (res) {
    let response = {
        status :400,
        message : "Something went Wrong",
        data : {}
    }
    res.send(JSON.stringify(response));
}

exports.userAlreadyExist = function (res) {
    let response = {
        status  : 400,
        message : "USER ALREADY EXIST",
        data    : []
    };
    res.send(JSON.stringify(response));
}

exports.accountAddedToStripe = function (res) {
    let response = {
        status  : 200,
        message : "ACCOUNT ADDED SUCCESSFULLY",
        data    : []
    }
    res.send(JSON.stringify(response));
}

exports.sendSuccessResponse = function (res,data) {
    let response = {
        status : 200,
        message : "SUCESSFULL",
        data : data
    }
    res.send(JSON.stringify(response));
}
