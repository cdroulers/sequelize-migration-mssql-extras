"use strict";
var Promise = require("bluebird");

module.exports = {
    create: function (config) {
        config = Object.assign({}, config);
        return new Promise((resolve, reject) => {

            var tedious = require('tedious');
            var hasDatabaseQuery = 'select name from master.dbo.sysdatabases WHERE name = \'' + config.database + '\'',
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
                    reject({ error: err, code: 1 });
                    return;
                }

                var request = new tedious.Request(hasDatabaseQuery, hasDatabaseCb)
                client.execSql(request);
            }

            function hasDatabaseCb(err, result) {
                if (err) {
                    reject({ error: err, code: 1 });
                    return;
                }

                if (result) {
                    client.close();
                    resolve({ message: "Database " + database + " already exists" });
                } else {
                    var request = new tedious.Request(createDatabaseQuery, createDatabaseCb);
                    client.execSql(request);
                }
            }

            function createDatabaseCb(err) {
                if (err) {
                    reject({ error: err, code: 1 });
                    return;
                }

                client.close();
                resolve({ message: "Database " + database + " created" });
            }
        });
    },
    drop: function (config, killConnections) {
        config = Object.assign({}, config);
        return new Promise((resolve, reject) => {

            var tedious = require('tedious');
            var hasDatabaseQuery = 'select name from master.dbo.sysdatabases WHERE name = \'' + config.database + '\'',
                dropDatabaseQuery = 'DROP DATABASE ' + config.database,
                database = config.database;

            if (killConnections) {
                dropDatabaseQuery = "DECLARE @DatabaseName nvarchar(50) = N'" + database + "'\n" +
                    "DECLARE @Sql varchar(max)\n" +
                    "SELECT @Sql = COALESCE(@Sql,'') + 'Kill ' + Convert(varchar, SPId) + ';'\n" +
                    "    FROM MASTER..SysProcesses\n" +
                    "    WHERE DBId = DB_ID(@DatabaseName) AND SPId <> @@SPId\n" +
                    "EXEC(@Sql)\n" +
                    dropDatabaseQuery;
            }

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
                    reject({ error: err, code: 1 });
                    return;
                }

                var request = new tedious.Request(hasDatabaseQuery, hasDatabaseCb)
                client.execSql(request);
            }

            function hasDatabaseCb(err, result) {
                if (err) {
                    reject({ error: err, code: 1 });
                    return;
                }

                if (!result) {
                    client.close();
                    resolve({ message: "Database " + database + " does not exist" });
                } else {
                    var request = new tedious.Request(dropDatabaseQuery, dropDatabaseCb);
                    client.execSql(request);
                }
            }

            function dropDatabaseCb(err) {
                if (err) {
                    reject({ error: err, code: 1 });
                    return;
                }

                client.close();
                resolve({ message: "Database " + database + " dropped" });
            }
        });
    }
}
