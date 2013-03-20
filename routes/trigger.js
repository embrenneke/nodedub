//  Copyright 2013 Emily Brenneke. All rights reserved.
//  Released under the MIT license.  See the LICENSE file in top directory of this project.

var dubstate = require('../models/dubstate.js'),
    crypto = require('crypto'),
    credentials = require('../models/credentials.js'),
    Validator = require('express-validator').Validator;

var validator = new Validator();

exports.try = function(req, res, next) {
  req.assert('action', 'Invalid action').len(16, 32).isAlphanumeric();
  req.sanitize('action').xss();
  var errors = req.validationErrors();
  if (!errors) {
    var decipher = crypto.createDecipher('aes-256-cbc', credentials.aesKey);
    var dec = decipher.update(req.param('action'), 'hex', 'utf8');
    dec += decipher.final('utf8');
    try {
      validator.check(dec, "").len(2, 5).isAlpha();

      var success = dubstate.trigger(dec);
      if (success) {
        res.send("SUCCESS");
      } else {
        next();
      }
    } catch (e) {
      console.log(e.message); //Invalid trigger
      next();
    }
  } else {
    console.log(errors);
    next();
  }
};

