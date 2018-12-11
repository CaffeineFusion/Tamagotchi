'use strict';

/**
 * increment - takes an object {a} and increments by the values of corresponding elements in object {b}.
 * 
 * 		This function is only for numeric values.	
 * 		Warning: Will enumerate over all keys on object. This would include functions.
 * 		Refactor: Error handling for non-numeric. RegEx: /^[a-zA-Z]+$/
 * 		
 * @param  {object} - key value pairs
 * @param  {object} - key value pairs
 * @return {object}
 */
module.exports.increment = (a, b) => {
	var result = deepClone(a);	
	Object.keys(b).forEach((key) => {
		//If the key exists in {a}, increment by corresponding value in {b}
		if(typeof a[key] !== undefined && a[key] !== null) {
			result[key] = a[key] + b[key];
		}
	});
	return result;	
};

/**
 * deepClone - safely clone an object removing prototypal inheritance.
 * 		Warning: function handling out of scope. Tested for strings and integers.
 * 		Refactor: A better implementation would adjust the prototypal chain, rather than serialising and deserialising the object.
 * 		
 * @param  {obj} obj A JavaScript Object
 * @return {obj}     A duplicate, but unlinked, object.
 */
var deepClone = (obj) => {
	return JSON.parse(JSON.stringify(obj));		// NOTE: Somewhat of a hack - This creates a new copy of an object, breaking the connection to its parent.
};
module.exports.deepClone = deepClone;