var postgres = require('pg');
const logger = require('../logger');

// create table entries (id serial primary key, key varchar(255) not null, value text not null, expiration int, unique(key));

var PostgresDocumentStore = function (options) {
  this.expireJS = options.expire;
  this.connectionUrl = process.env.DATABASE_URL || options.connectionUrl;
};

PostgresDocumentStore.prototype = {
  set: function (key, data, callback, skipExpire) {
    var now = Math.floor(new Date().getTime() / 1000);
    var that = this;
    this.safeConnect(function (err, client, done) {
      if (err) { return callback(false); }
      client.query('INSERT INTO entries (key, value, expiration) VALUES ($1, $2, $3) ON CONFLICT (key) DO UPDATE SET value = excluded.value', [
        key,
        data,
        that.expireJS && !skipExpire ? that.expireJS + now : null
      ], function (err) {
        if (err) {
          logger.error('error persisting value to postgres', { error: err });
          return callback(false);
        }
        callback(true);
        done();
      });
    });
  },

  get: function (key, callback, skipExpire) {
    var now = Math.floor(new Date().getTime() / 1000);
    var that = this;
    this.safeConnect(function (err, client, done) {
      if (err) { return callback(false); }
      client.query('SELECT id,value,expiration from entries where KEY = $1 and (expiration IS NULL or expiration > $2)', [key, now], function (err, result) {
        if (err) {
          logger.error('error retrieving value from postgres', { error: err });
          return callback(false);
        }
        callback(result.rows.length ? result.rows[0].value : false);
        if (result.rows.length && that.expireJS && !skipExpire) {
          client.query('UPDATE entries SET expiration = $1 WHERE ID = $2', [
            that.expireJS + now,
            result.rows[0].id
          ], function (err) {
            if (!err) {
              done();
            }
          });
        } else {
          done();
        }
      });
    });
  },

  safeConnect: function (callback) {
    postgres.connect(this.connectionUrl, function (err, client, done) {
      if (err) {
        logger.error('error connecting to postgres', { error: err });
        callback(err);
      } else {
        callback(undefined, client, done);
      }
    });
  }
};

module.exports = PostgresDocumentStore;
