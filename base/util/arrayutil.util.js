
var arrayUtil = {};

var findIndexByField = function(i, a, f) {
	if (f == undefined && !i)
		return false;
	
	for (var key in a) {
		console.log(a[key][f]);
		if (a[key][f] == i)
			return key;
	}
	
	return false;
};

arrayUtil.findIndexByField = findIndexByField;
module.exports.arrayUtil = arrayUtil;
global.UTILS.arrayUtil = arrayUtil;
