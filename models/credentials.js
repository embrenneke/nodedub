//  Copyright 2013 Emily Brenneke. All rights reserved.
//  Released under the MIT license.  See the LICENSE file in top directory of this project.

/* for encoding/decoding confirmation string */
exports.aesKey = process.env.CONFIRM_AES_KEY || "";
if (exports.aesKey == "") {
  console.log("Error: Missing AES key.  Won't be able to process confirmation emails.");
}

/* gmail details for sending confirmation email */
exports.gmailUser = process.env.GMAIL_USER || "";
exports.gmailPass = process.env.GMAIL_PASS || "";
if (exports.gmailUser == "" || exports.gmailPass == "") {
  console.log("Error: Missing gmail user/pass.  Won't be able to send email.");
}

/* mailgun details for sending mass email */
exports.mgApiKey = process.env.MAILGUN_API_KEY || "";
exports.mgSmtpLogin = process.env.MAILGUN_SMTP_USER || "";
exports.mgSmtpPasswd = process.env.MAILGUN_SMTP_PASS || "";
exports.mgListName = process.env.MAILGUN_LIST_NAME || "";
if (exports.mgApiKey == "" || exports.mgSmtpLogin == "" ||
    exports.mgSmtpPasswd == "" || exports.mgListName == "") {
  console.log("Error: Missing required mailgun info. Won't be able to add users to mailing list/send bulk email.");
}

