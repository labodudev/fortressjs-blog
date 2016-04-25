module.exports = article;

function article(post)
{
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
      "primary": true,
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
      "type": "number",
      "default": Date.now()
    },
    "date_modified": {
      "type": "number",
      "default": Date.now()
    }

  };

  this.obj = {};

  this.getPrimaryField = function() {
    for (var key in this.structureToValidate) {
      if (this.structureToValidate[key].primary)
        return key;
    }

    return undefined;
  }

  this.validate = function(data) {
    for (var key in this.structureToValidate) {
      // If is required
      if (this.structureToValidate[key].required && UTILS.dataUtil.isEmpty(post[key])) {
        return false;
      }

      // Check type
      if (!UTILS.dataUtil.isEmpty(post[key]) && typeof post[key] != this.structureToValidate[key].type && this.structureToValidate[key].default == undefined) {
        return false;
      }

      this.obj[key] = post[key];

      // Default value if empty
      if (!this.obj[key] && this.structureToValidate[key].default) {
        if(this.structureToValidate[key].default.field)
          this.obj[key] = this.structureToValidate[key].default.function(this.obj[this.structureToValidate[key].default.field]);
        else {
          this.obj[key] = this.structureToValidate[key].default;
        }
      }

      // Unique field
      if (this.structureToValidate[key].unique && !UTILS.dataUtil.isEmpty(data)) {
          this.obj[key] = this.obj[key] + "-" + UTILS.dataUtil.uniqueField(this.obj[key], data, key, 0);
      }
    }

    return true;
  }

  /** Before use it, use, validate method */
  this.toObject = function() {
    if (UTILS.dataUtil.isEmpty(this.obj))
      return false;

    return this.obj;
  }
}
