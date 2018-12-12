let md5                                       = require('md5');

exports.generateAcceeToken                    = generateAccessToken;

function generateAccessToken(email,password) {
    let secretKey = md5(""+email+password+new Date());
    return secretKey;
}
