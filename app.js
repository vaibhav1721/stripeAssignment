const express           = require('express');
const bodyParser        = require('body-parser');

process.env.NODE_CONFIG_DIR                = 'config/';
config                                     = require('config');
const errorhandler                         = require('errorhandler');
const startServices                        = require('./services/startupServices');

const app = express();
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
global.app = app;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,accept-language');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
//Will require all modules here

require("./modules")

if ('development' == app.get('env')) {
    app.use(errorhandler());
}
startServices.initializeServer()
