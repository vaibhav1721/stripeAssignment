
let config                                        = require('config');

exports.databaseSettings = {
    mysql : {
        master: {
            host              : config.get('databaseSettings.host'),
            user              : process.env.MYSQL_USER || config.get('databaseSettings.user'),
            password          : process.env.MYSQL_PASS || config.get('databaseSettings.password'),
            database          : config.get('databaseSettings.database'),
            multipleStatements: true
        },
    },
    mongo : {
        connectionString : config.get('databaseSettings.mongo_db_connection')
    }
};

exports.port            = process.env.PORT || config.get('PORT');
