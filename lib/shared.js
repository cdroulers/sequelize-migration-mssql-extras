module.exports = {
    create: function (rootPath) {
        process.env.NODE_ENV = process.env.NODE_ENV || 'development';
        console.log('Using NODE_ENV=' + process.env.NODE_ENV);

        var tedious = require('tedious');
        var config = require('./load_configuration')(rootPath),
            hasDatabaseQuery = 'select name from master.dbo.sysdatabases WHERE name = \'' + config.database + '\'',
            createDatabaseQuery = 'CREATE DATABASE ' + config.database,
            database = config.database;

        // Since we want to connect to master, not the specific database
        delete config.database;
        config.userName = config.username;
        delete config.username;

        var client = new tedious.Connection(config);
        client.on("connect", clientConnect);

        function clientConnect(err) {
            if (err) {
                console.error(err);
                return process.exit(1);
            }

            var request = new tedious.Request(hasDatabaseQuery, hasDatabaseCb)
            client.execSql(request);
        }

        function hasDatabaseCb(err, result) {
            if (err) {
                console.error(err);
                return process.exit(1);
            }

            if (result) {
                console.log('Database', database, 'already exists');
                client.close();
            } else {
                var request = new tedious.Request(createDatabaseQuery, createDatabaseCb);
                client.execSql(request);
            }
        }

        function createDatabaseCb(err) {
            if (err) {
                console.error(err);
                return process.exit(1);
            }

            console.log('Database', database, 'created');
            client.close();
        }
    },
    drop: function (rootPath) {
        process.env.NODE_ENV = process.env.NODE_ENV || 'development';
        console.log('Using NODE_ENV=' + process.env.NODE_ENV);

        var tedious = require('tedious');
        var config = require('./load_configuration')(rootPath),
            hasDatabaseQuery = 'select name from master.dbo.sysdatabases WHERE name = \'' + config.database + '\'',
            dropDatabaseQuery = 'DROP DATABASE ' + config.database,
            database = config.database;

        // Since we want to connect to master, not the specific database
        delete config.database;
        config.userName = config.username;
        delete config.username;

        // Protection against stupidity and fuckups
        if (process.env.NODE_ENV.indexOf('production') !== -1 && process.env.FORCE !== 'true') {
            console.warn('You were about to drop a production database');
            console.warn('To drop a production database you must pass FORCE=true');
            console.warn('For example: NODE_ENV=production FORCE=true ./node_modules/.bin/drop_database');
            return process.exit(1);
        }

        var client = new tedious.Connection(config);
        client.on("connect", clientConnect);

        function clientConnect(err) {
            if (err) {
                console.error(err);
                return process.exit(1);
            }

            var request = new tedious.Request(hasDatabaseQuery, hasDatabaseCb)
            client.execSql(request);
        }

        function hasDatabaseCb(err, result) {
            if (err) {
                console.error(err);
                return process.exit(1);
            }

            if (!result) {
                console.log('Database', database, 'does not exist');
                client.close();
            } else {
                var request = new tedious.Request(dropDatabaseQuery, dropDatabaseCb);
                client.execSql(request);
            }
        }

        function dropDatabaseCb(err) {
            if (err) {
                console.error(err);
                return process.exit(1);
            }

            console.log('Database', database, 'dropped');
            client.close();
        }
    }
}