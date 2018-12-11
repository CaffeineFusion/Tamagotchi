'use strict';

/**
* Mock DB - Basic JSON objects represents Data Object. 
* DB would be expanded out to an external data source.
* 
**/

var database = {};

module.exports = class MockDB {

	constructor() {
	}

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
		return this.update(1, JSON.parse(JSON.stringify(d)));	// NOTE: Somewhat of a hack - This is deep cloning the JSON object. Otherwise, updates would affect the original object.
	}
};