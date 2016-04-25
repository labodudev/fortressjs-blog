
var dataUtil = {};

var isEmpty = function(d) {

    if (d === null) return true;

    if (d.length > 0)    return false;
    if (d.length === 0)  return true;

    for (var key in d) {
        if (hasOwnProperty.call(d, key)) return false;
    }

    return true;
};

var sanitizeTitle = function (str)
{
	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
	var to   = "aaaaeeeeiiiioooouuuunc------";

	for (var i=0, l=from.length ; i<l ; i++)
	{
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-'); // collapse dashes

	return str;
};

var uniqueField = function(str, obj, field, number) {
	if (isEmpty(obj))
		return str + "-0";
	
	if(number === undefined)
		number = 0;
	
	for (var key in obj) {
		if (obj[key][field] == str + "-" + number) {
			number++;
			number = uniqueField(str, obj, field, number);
			break;
		}
	}
	
	return number;
};

dataUtil.isEmpty = isEmpty;
dataUtil.sanitizeTitle = sanitizeTitle;
dataUtil.uniqueField = uniqueField;
module.exports.dataUtil = dataUtil;
global.UTILS.dataUtil = dataUtil;
