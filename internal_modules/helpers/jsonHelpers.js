'use strict';

/**
 * incrementJSON - takes a JSON object {a} and increments by the values of corresponding elements in JSON object {b}.
 * 
 * 		This function is only for numeric values.
 * 		TODO: error handling for non-numeric. RegEx: /^[a-zA-Z]+$/	
 * 		Warning: Will enumerate over all keys on object. This would include functions.
 * 		
 * @param  {object} - key value pairs
 * @param  {object} - key value pairs
 * @return {object}
 */
module.exports.incrementJSON = (a, b) => {
	var result = deepCloneJSON(a);	
	Object.keys(b).forEach((key) => {
		//If the key exists in {a}, increment by corresponding value in {b}
		if(typeof a[key] !== undefined && a[key] !== null) {
			result[key] = a[key] + b[key];
		}
	});
	return result;	
};

/**
 * deepCloneJSON - safely clone an object so as to cleanse link to parent object.
 * 		Warning: function handling out of scope. Tested for strings and integers.
 * 		
 * @param  {obj} obj A JavaScript Object
 * @return {obj}     A duplicate, but unlinked, object.
 */
var deepCloneJSON = (obj) => {
	return JSON.parse(JSON.stringify(obj));		// NOTE: Somewhat of a hack - This creates a new copy of an object, breaking the connection to its parent.
};
module.exports.deepCloneJSON = deepCloneJSON;