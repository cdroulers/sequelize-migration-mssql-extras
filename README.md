# Original code!

This is a fork of [sequelize-migration-mssql-extras](https://github.com/cesarandreu/sequelize-migration-mssql-extras)
to get the same scripts for MSSQL.

# sequelize-migration-mssql-extras

Easily add `npm run db:create` and `npm run db:drop` to your Sequelize project using MSSQL.


## Usage

```sh
$ npm install sequelize-migration-mssql-extras
```

Then add the following to the scripts section in package.json:

```json
{
  "scripts": {
    "db:create": "create_database",
    "db:drop": "drop_database"
  }
}
```


## Configuration

If a `.sequelizerc` file is found, it will attempt the config location from there.
Otherwise it will use `config/config.json` or `config/config.js` depending on which exists.


## Test

TESTS ADDED!

You must have MSSQL running beforehand on a default instance (or remap port 1433 to your instance).

    npm run test
    
This runs tests that load configuration and tries to create and drop a database. It doesn't assert much yet
because life's too short sometimes.


### create_database

```sh
$ ../../lib/create_database.js
```

**Scenarios:**

Database doesn't exist:

```
> Using NODE_ENV=development
> Using configuration in /Users/cesarandreu/Developer/sequelize-migration-mssql-extras/test/default/config/config.json
> Database sequelize_migration_mssql_extras_development created
```


Database exists:

```
> Using NODE_ENV=development
> Using configuration in /Users/cesarandreu/Developer/sequelize-migration-mssql-extras/test/default/config/config.json
> Database sequelize_migration_mssql_extras_development already exists
```


### drop_database

```sh
$ ../../lib/drop_database.js
```

**Scenarios:**

Database exists:

```
> Using NODE_ENV=development
> Using configuration in /Users/cesarandreu/Developer/sequelize-migration-mssql-extras/test/default/config/config.json
> Database sequelize_migration_mssql_extras_development dropped
```

Database doesn't exist:

```
> Using NODE_ENV=development
> Using configuration in /Users/cesarandreu/Developer/sequelize-migration-mssql-extras/test/default/config/config.json
> Database sequelize_migration_mssql_extras_development doesn't exist
```
