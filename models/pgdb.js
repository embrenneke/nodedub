//  Copyright 2013 Emily Brenneke. All rights reserved.
//  Released under the MIT license.  See the LICENSE file in top directory of this project.

var performQuery = function(queryString, cb) {
  var databaseURL = process.env.DATABASE_URL || "postgres://localhost:5432/dubdub";
  var pg = require('pg');
  var client = new pg.Client(databaseURL);
  client.connect();
  var query = client.query(queryString, function(err, result) {
    cb(err, result);
    client.end();
  });
};

var registerEmail = function(email, nonce, callback) {
  var queryString = 'INSERT INTO registrations (nonce, email) VALUES (\'' + nonce + '\', \'' + email + '\')';
  performQuery(queryString, function(err, result) {
    if (err) {
      console.log(err);
      callback(false);
    } else { 
      callback(true);
    }
  });
};

var confirmEmail = function(email, nonce, callback) {
  var queryString = 'UPDATE registrations SET confirmed=true WHERE email=\'' + email + '\' AND nonce =\'' + nonce + '\'';
  performQuery(queryString, function(err, result) {
    if (!err && (result.rowCount > 0)) {
      callback(true);
    } else {
      console.log(err);
      console.log(result);
      callback(false);
    }
  });
};

var hasEmailed = function(callback) {
  var queryString = 'SELECT * FROM registrations WHERE emailed=true LIMIT 1';
  performQuery(queryString, function(err, result) {
    if (err || (result.rowCount > 0)) {
      // yes, I mean true if error or already done.  We don't want to accidentally
      // allow another email if we couldn't connect to the database.
      if (err) console.log(err);
      callback(true);
    } else {
      callback(false);
    }
  });
};

var recordEmailedAllConfirmed = function() {
  var queryString = 'UPDATE registrations SET emailed=true WHERE confirmed=true';
  performQuery(queryString, function(err, result) {
    if (err) {
      // TODO: report failure?
      console.log(err);
    }
  });
};

var cullUnconfirmedEmails = function() {
  var queryString = "DELETE FROM registrations WHERE confirmed=false AND now() - time > interval '1' day";
  performQuery(queryString, function(err, result) {
    if (err) {
      // TODO: report failure?
      console.log(err);
    }
  });
};

exports.registerEmail = registerEmail;
exports.confirmEmail = confirmEmail;
exports.hasEmailed = hasEmailed;
exports.recordEmailedAllConfirmed = recordEmailedAllConfirmed;
exports.cullUnconfirmedEmails = cullUnconfirmedEmails;

