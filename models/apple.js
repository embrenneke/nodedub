//  Copyright 2013 Emily Brenneke. All rights reserved.
//  Released under the MIT license.  See the LICENSE file in top directory of this project.

var https = require('https'),
    dubstate = require('./dubstate.js');

var checkYear = function () {
  https.get('https://developer.apple.com/wwdc/', function(res) {
    var wwdcContent = "";
    res.setEncoding('utf8');
    res.on('data', function (d) {
      wwdcContent = wwdcContent.concat(d);
    });
    res.on('end', function() {
      var oldyear = wwdcContent.match(/2013/g);
      var newyear = wwdcContent.match(/2014/g);
      if (oldyear) {
        oldyear = oldyear.length;
      } else {
        oldyear = 0;
      }
      if (newyear) {
        newyear = newyear.length;
      } else {
        newyear = 0;
      }

      if ((dubstate.currentState == dubstate.DUBSTATES.NO) && (newyear > oldyear)) {
        dubstate.trigger("MAYBE");
      }
    });
  });
};

exports.checkYear = checkYear;

