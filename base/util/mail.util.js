var mail = {};
mail.sendmail = require('./sendmail/sendmail.lib.js')();

module.exports.mailUtil = mail;
UTILS.mailUtil = mail;