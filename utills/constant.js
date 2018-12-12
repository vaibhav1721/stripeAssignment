exports.responseFlags = {
    PARAMETER_MISSING_IN_REQUEST : 100,
    EMAIL_ALREADY_EXIST : 400,
    PATIENT_CREATED : 200,
    SOMETHING_WENT_WRONG: 400
};

exports.responseMessage = {
    PARAMETER_MISSING_IN_REQUEST : "Parameter is missing from request. Please Check.",
    EMAIL_ALREADY_EXIST : "Email already exist with us.",
    PATIENT_CREATED: "Patient Created Successfully",
    SOMETHING_WENT_WRONG : "Something went wrong.Please check"
}

exports.userActiveStatus = {
    ACTIVE  : 1,
    INACTIVE: 0
};

exports.userBlockedStatus = {
    BLOCKED : 1,
    UNBLOCKED : 0
};

exports.userDeletedStatus = {
    DELETED : 1,
    NOTDELETED : 0
};
