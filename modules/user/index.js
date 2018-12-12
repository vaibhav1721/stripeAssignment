const userController            = require('../user/userController/userController');
const userValidator             = require('../user/userValidator/userValidator');

app.post('/createUser', userValidator.createUser, userController.createUser);
