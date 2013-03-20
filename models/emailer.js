//  Copyright 2013 Emily Brenneke. All rights reserved.
//  Released under the MIT license.  See the LICENSE file in top directory of this project.

var nodemailer = require('nodemailer'),
    mailgun = require('mailgun'),
    credentials = require('./credentials.js'),
    https = require('https');

var sendConfirmationEmail = function(address, url) {
  var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: credentials.gmailUser,
      pass: credentials.gmailPass
    }
  });

  var mailOptions = {
    from: "Is WWDC Sold Out Yet? " + credentials.gmailUser,
    to: address,
    subject: "Confirmation Email",
    text: "Please visit " + url + " within 24 hours to confirm your email address or your registration will not be saved.",
    html: "Please visit <a href=\"" + url + "\">" + url + "</a> within 24 hours to confirm your email address or your registration will not be saved."
  }

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
    }

    smtpTransport.close();
  });
};

var sendWWDCAnnouncement = function() {
  var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Mailgun",
    auth: {
      user: credentials.mgSmtpLogin,
      pass: credentials.mgSmtpPasswd
    }
  });
  var mailOptions = {
    from: credentials.gmailUser,
    to: credentials.mgListName,
    subject: "WWDC on sale now?",
    text: "The WWDC page at https://developer.apple.com/wwdc/ changed.  Better go check it.",
  }
  smtpTransport.sendMail(mailOptions, function(err, res) {
    if (err) {
      console.log(err);
    }

    smtpTransport.close();
    console.log('***********  WWDC Announcement SENT ***********');
  });
};

var addUserToMailingList = function(email) {
  var auth = "Basic " + new Buffer('api:' + credentials.mgApiKey).toString("base64");
  var body = "subscribed=True&address=" + encodeURIComponent(email);
  console.log(body);

  var options = {
    hostname: "api.mailgun.net",
    port: 443,
    path: "/v2/lists/" + credentials.mgListName + "/members",
    method: "POST",
    headers: {
      "Authorization" : auth,
      "Content-Type" : 'application/x-www-form-urlencoded',
      "Content-Length" : body.length
    }
  }

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(d) {
      // We should check the response for error and let the user know if it failed to subscribe.
      console.log(d);
    });
  });
  req.end(body);

  req.on('error', function(e) {
    console.log(e);
  });
};

exports.sendConfirmationEmail = sendConfirmationEmail;
exports.sendWWDCAnnouncement = sendWWDCAnnouncement;
exports.addUserToMailingList = addUserToMailingList;
