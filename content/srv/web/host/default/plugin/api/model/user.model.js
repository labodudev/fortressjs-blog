var object = require('./object.model.js');

module.exports = user;

function user(post)
{
  object.call(this, post);

  this.structureToValidate = {
    "pseudo": {
      "type": "string",
      "required": true
    },
    "password": {
      "type": "string",
      "show": false,
      "required": true,
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
