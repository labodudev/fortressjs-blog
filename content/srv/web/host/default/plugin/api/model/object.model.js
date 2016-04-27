module.exports = object;

function object(method, post) {
  this.obj = {};

  this.validate = function(data, where) {
    for (var key in this.structureToValidate) {
      // If is required
      if (this.structureToValidate[key].required && UTILS.dataUtil.isEmpty(post[key])) {
        return false;
      }

      // Check type
      if (!UTILS.dataUtil.isEmpty(post[key]) && typeof post[key] != this.structureToValidate[key].type && this.structureToValidate[key].default === undefined) {
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
      if (this.structureToValidate[key].unique && !UTILS.dataUtil.isEmpty(data) && method != "GET") {
        var number = UTILS.dataUtil.uniqueField(this.obj[key], data, key, 0);
        if (number > 0)
          this.obj[key] = this.obj[key] + "-" + number;
      }

      // Function method
      if (this.obj[key] && this.structureToValidate[key].function && this.structureToValidate[key].function[method] && post && post[key] && method != "GET") {
        var tmp = this.structureToValidate[key].function[method](post[key], this.obj[key]);
        if (typeof tmp == "boolean" && !tmp) {
          return false;
        }
        else {
          this.obj[key] = tmp;
        }
      }
    }

    if (where) {
      for (var key in where) {
        if (this.obj[key] && this.obj[key] && where[key]) {
            // Check function ?
            if(this.structureToValidate[key].function && this.structureToValidate[key].function["GET"]) {
              var tmp = this.structureToValidate[key].function["GET"](where[key], this.obj[key]);

              if (typeof tmp == "boolean" && !tmp) {
                return false;
              }
              else {
                this.obj[key] = tmp;
              }
            }
            else {
              // Check value ?
              if(key == 'slug') {
                console.log(where[key]);
                console.log(this.obj[key]);
              }
              if (where[key] != this.obj[key])
                return false;
            }
        }
      }
    }

    return true;
  };

  /** Before use it, use, validate method */
  this.toObject = function() {
    if (UTILS.dataUtil.isEmpty(this.obj))
      return false;

    var finalObj = {};
    for (var key in this.obj) {
      if((this.structureToValidate[key].show != false && method == "GET") || method != "GET") {
        finalObj[key] = this.obj[key];
      }
    }

    return finalObj;
  };
}
