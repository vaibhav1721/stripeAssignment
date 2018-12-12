const Promise = require('bluebird');

const userService = require('../userServices/userService');
exports.createUser = createUser;

function createUser(req, res) {
    Promise.coroutine(function *() {
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;

        let userDetails = yield userService.getUserDetails(email);
        if(userDetails.length){
            throw "User Already exist with this email";
        }
        let insertData = yield userService.createUser({email: email,name:name, password:password});
        return insertData.insertId;
    })().then((data)=>{
        res.send("user created", data)
    },(err)=>{
        res.send("Some error occured while creating user", err);
    })
}
