'use strict';

/**
* Mock DB - Basic JSON objects represents Data Object. 
* DB would be expanded out to an external data source.
* 
**/

var objHelpers = require('./helpers/objHelpers.js');

var database = {};

module.exports = class MockDB {

	constructor() {
	}

	/**
	 * get - get Database entry {id} - hardcoded. id === 1. Returns full "database" object.
	 * @param  {int} id identifier for record
	 * @return {obj} record as javascript object
	 */
	get(id) {
		return new Promise((resolve, reject) => {
			//console.log('id: ', id);
			//console.log('database: ', database);
			if(database) return resolve(database);
			else return reject({'message':'No Tamgotchi ' + id + ' found!'});
		});
	}

	update(id, d) {
		return new Promise((resolve, reject) => {
			database = d;
			return resolve(database);
		});
	}

	/**
	 * create(data) - in theory creates a new record in the db. Out-of-scope, we're just overwriting the single entry.
	 * @param  {[type]} d [description]
	 * @return {[type]}   [description]
	 */
	create(d) {
		return this.update(1, objHelpers.deepClone(d));	//DeepClone Required to decouple the database instance from the template object. Otherwise, updating the database would update the template object as well!
	}
};