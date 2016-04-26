var object = require('./object.model.js');

module.exports = article;

function article(post)
{
  object.call(this, post);

  this.structureToValidate = {
    "name": {
      "type": "string",
      "required": true
    },
    "content": {
      "type": "string",
    },
    "slug": {
      "type": "string",
      "unique": true,
      "default": {
        "function": UTILS.dataUtil.sanitizeTitle,
        "field": "name"
      }
    },
    "status": {
      "type": "string",
      "default": "publish"
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
