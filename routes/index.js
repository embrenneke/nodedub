//  Copyright 2013 Emily Brenneke. All rights reserved.
//  Released under the MIT license.  See the LICENSE file in top directory of this project.

var url = require('url'),
    adder = require('./add.js'),
    confirmer = require('./confirm.js'),
    dubstate = require('../models/dubstate.js'),
    triggerer = require('./trigger.js');

exports.index = function(req, res) {
  res.render('index', { title: 'Is WWDC Sold Out Yet?',
                        value: dubstate.currentState.name,
                  description: dubstate.currentState.description });
};

exports.privacy = function(req, res) {
  res.render('privacy', { title: 'Privacy Policy' });
};

exports.add = function(req, res) {
  adder.insert(req, res);
};

exports.confirmed = function(req, res) {
  confirmer.save(req, res);
};

exports.trigger = function(req, res, next) {
  triggerer.try(req, res, next);
};
