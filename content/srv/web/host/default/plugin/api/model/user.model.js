var object = require('./object.model.js');
var bcrypt = require('bcrypt-nodejs');

module.exports = user;

function user(method, post)
{
  object.call(this, method, post);

  this.structureToValidate = {
    "pseudo": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "string",
      "unique": true,
      "default": {
        "function": UTILS.dataUtil.sanitizeTitle,
        "field": "pseudo"
      }
    },
    "password": {
      "type": "string",
      "show": false,
      "required": false,
      "function": {
        "PUT": hachPassword,
        "GET": comparePassword,
      }
    },
    "date": {
      "type": "string",
      "default": new Date().toDateString(),
    },
    "date_modified": {
      "type": "string",
      "default": new Date().toDateString(),
    }
  };
}

function hachPassword(post, str) {
  return bcrypt.hashSync(str);
}

function comparePassword(post, str) {
  return bcrypt.compareSync(post, str); // true
}
