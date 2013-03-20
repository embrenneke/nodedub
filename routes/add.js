//  Copyright 2013 Emily Brenneke. All rights reserved.
//  Released under the MIT license.  See the LICENSE file in top directory of this project.

var db = require('../models/pgdb.js'),
    emailer = require('../models/emailer.js'),
    crypto = require('crypto'),
    credentials = require('../models/credentials.js');

exports.insert = function(req, res) {
  req.assert('email', 'Invalid email').len(6, 320).isEmail();
  var errors = req.validationErrors();
  if (!errors) {
    var email = req.param('email');
    var nonce = Math.random().toString(36).substring(2, 10);
    db.registerEmail(email, nonce, function(result) {
      if(result) {
        var confirmationString = email + ":" + nonce;
        var cipher = crypto.createCipher('aes-256-cbc', credentials.aesKey);
        var crypted = cipher.update(confirmationString, 'utf8', 'hex');
        crypted += cipher.final('hex');
        var url = "http://" + req.headers.host + "/confirm?confirmationString=" + crypted;
        emailer.sendConfirmationEmail(email, url);
        res.render('confirm', { title: 'Please Confirm To Complete Registration' });
      } else {
        res.render('add-failed', {title: 'Failed to Register' });
      }
    });
  } else {
    console.log(errors);
    res.render('add-failed', {title: 'Failed to Register' });
  }
};

