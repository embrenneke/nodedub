//  Copyright 2013 Emily Brenneke. All rights reserved.
//  Released under the MIT license.  See the LICENSE file in top directory of this project.

var emailer = require('./emailer.js'),
    pg = require('./pgdb.js');

var DUBSTATES = {
  NO : {name: "NOPE", description: "Tickets are not on sale yet." },
  MAYBE : {name: "ALMOST", description: "Tickets have gone on sale. Go!"},
  YES : {name: "YEP", description: "You are too late, they sold out." }
};

var currentState = DUBSTATES.NO;

var trigger = function(action) {
  var acted = false;
  if (action) {
    if (action == "YES") {
      currentState = DUBSTATES.YES;
      acted = true;
    } else if (action == "MAYBE") {
      currentState = DUBSTATES.MAYBE;
      pg.hasEmailed(function (result) {
        if (!result) {
          // only email if we haven't already sent one
          emailer.sendWWDCAnnouncement();
          pg.recordEmailedAllConfirmed();
        }
      });
      acted = true;
    } else if (action == "NO") {
      currentState = DUBSTATES.NO;
      acted = true;
    }
  }
  if (acted) exports.currentState = currentState;
  return acted;
};

exports.DUBSTATES = DUBSTATES;
exports.currentState = currentState;
exports.trigger = trigger;
