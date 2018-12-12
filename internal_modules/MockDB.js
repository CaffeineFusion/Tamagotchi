'use strict';

/**
* Mock DB - Basic javascript object moonlighting as database. 
* Future: DB would be expanded out to an external, persistent data source.
* 
**/

var objHelpers = require('./helpers/objHelpers.js');

var database = {};

module.exports = class MockDB {

	constructor() {
	}

	/**
	 * get - get Database entry {id} - hardcoded. Returns full "database" object.
	 * @param  {int} id identifier for record
	 * @return {Promise} returns a Promise resolving to the state of the record.
	 */
	get(id) {
		return new Promise((resolve, reject) => {
			//console.log('id: ', id);
			//console.log('database: ', database);
			if(database) return resolve(objHelpers.deepClone(database));	// Deep Clone to ensure decoupling with output (breaks reference to original)
			else return reject({'message':'No Tamgotchi ' + id + ' found!'});
		});
	}

	/**
	 * update - updates record {id} (hard coded to update full database object) with object {d}
	 * @param  {int} id    record identifer
	 * @param  {obj} d     data to be updated
	 * @return {Promise}   a Promise resolving to the new state of the record
	 */
	update(id, d) {
		return new Promise((resolve, reject) => {
			database = objHelpers.deepClone(d);					// DeepClone Required to decouple the database instance from the template object. Otherwise, updating the database would update the template object as well!
			return resolve(objHelpers.deepClone(database));		// Deep Clone to ensure decoupling with output (breaks reference to original)
		});
	}

	/**
	 * create(data) - in theory creates a new record in the db. Out-of-scope, we're just overwriting the single entry.
	 * @param  {obj} d    data to be stored
	 * @return {Promise}  a Promise resolving to the new state of the record
	 */
	create(d) {
		return this.update(1, d);	
	}
};