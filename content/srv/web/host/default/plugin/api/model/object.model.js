module.exports = object;

function object(post) {
  this.obj = {};

  this.validate = function(method, data) {
    for (var key in this.structureToValidate) {
      // If is required
      if (this.structureToValidate[key].required && UTILS.dataUtil.isEmpty(post[key])) {
        return false;
      }

      // Check type
      if (!UTILS.dataUtil.isEmpty(post[key]) && typeof post[key] != this.structureToValidate[key].type && this.structureToValidate[key].default === undefined) {
        return false;
      }

      if ((method == 'GET' && this.structureToValidate[key].show != false) || method != 'GET') {
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
    }

    return true;
  };

  /** Before use it, use, validate method */
  this.toObject = function() {
    if (UTILS.dataUtil.isEmpty(this.obj))
      return false;

    return this.obj;
  };
}
