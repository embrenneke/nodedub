//  Copyright 2013 Emily Brenneke. All rights reserved.
//  Released under the MIT license.  See the LICENSE file in top directory of this project.

var db = require('../models/pgdb.js'),
    crypto = require('crypto'),
    credentials = require('../models/credentials.js'),
    emailer = require('../models/emailer.js'),
    Validator = require('express-validator').Validator;

var validator = new Validator();

exports.save = function(req, res) {
  // aes has a fixed block size of 16. string is 15-329, so used closest multiple of 16
  req.assert('confirmationString', 'Invalid Confirmation').len(16, 336).isAlphanumeric();
  var errors = req.validationErrors();
  if (!errors) {
    var decipher = crypto.createDecipher('aes-256-cbc', credentials.aesKey);
    var dec = decipher.update(req.param('confirmationString'), 'hex', 'utf8');
    dec += decipher.final('utf8');
    var parts = dec.split(":");
    var email = parts[0];
    var nonce = parts[1];
    try {
      validator.check(email, "email length + content").len(6, 320).isEmail();
      validator.check(nonce, "nonce length + content").len(1, 8).isAlphanumeric();
    } catch (e) {
      console.log(e.message); //Invalid email or nonce
      res.render('confirm-failed', {title: 'Failed to Confirm Email Address' });
      return;
    }
    db.confirmEmail(email, nonce, function(result) {
      if(result) {
        res.render('confirmed', { title: 'Confirmed' });
        emailer.addUserToMailingList(email);
      } else {
        res.render('confirm-failed', { title: 'Failed to Confirm Email Address' });
      }
    });
  } else {
    console.log(errors);
    res.render('confirm-failed', { title: 'Failed to Confirm Email Address' });
  }
};

