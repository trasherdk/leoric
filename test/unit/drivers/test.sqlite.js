'use strict';

const assert = require('assert').strict;
const { DataTypes } = require('../../..');
const SqliteDriver = require('../../../lib/drivers/sqlite');

const { INTEGER } = DataTypes;

const driver = new SqliteDriver('sqlite', {
  database: '/tmp/leoric.sqlite3',
});

describe('=> SQLite driver', () => {
  it('driver.logger', async () => {
    const result = [];
    const driver2 = new SqliteDriver('sqlite', {
      database: '/tmp/leoric.sqlite3',
      logger(sql) {
        result.push(sql);
      },
    });
    await driver2.query('SELECT 1');
    assert.equal(result[0], 'SELECT 1');
  });

  it('driver.querySchemaInfo()', async () => {
    const schemaInfo = await driver.querySchemaInfo(null, 'articles');
    assert.ok(schemaInfo.articles);
    const columns = schemaInfo.articles;
    const props = [
      'columnName', 'columnType', 'dataType', 'defaultValue', 'allowNull',
    ];
    for (const column of columns) {
      for (const prop of props) assert.ok(column.hasOwnProperty(prop));
    }
  });

  it('driver.createTable(table, definitions)', async () => {
    await driver.dropTable('notes');
    await driver.createTable('notes', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      public: { type: INTEGER },
    });
  });
});