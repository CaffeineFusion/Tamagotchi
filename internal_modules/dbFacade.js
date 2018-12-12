'use strict';

/**
* DBFacade - seperate implementation of datastore from business logic.
**/

var objHelpers = require('./helpers/objHelpers.js');
var db = new (require('./MockDB.js'))();

/**
 * increment() - increments one object {state} by the values in another {modifiers} before saving this to the database
 * @param  {int} id        record identifier
 * @param  {obj} state     obj to be updated
 * @param  {obj} modifiers values to be added
 * @return {Promise}       a Promise resolving to the new state of the DB
 */
module.exports.increment = (id, state, modifiers) => {
	return db.update(id, objHelpers.increment(state, modifiers));
};

/**
 * getState - returns the state of a given record
 * @param  {int} id 	record identifer
 * @return {Promise}    a Promise resolving to the state of the record
 */
var getState = (id) => {
	return db.get(id);
};
module.exports.getState = getState;

/**
 * create - creates a new record in the database
 * @param  {obj} record  data to be stored
 * @return {Promise}        a Promise resolving to the state of the new record
 */
module.exports.create = (record) => {
	return db.create(record);
};

/**
 * update - overwrites an existing record {id} with its new complete state
 * @param  {int} id      record identifer to be overwritten
 * @param  {obj} updates data to be stored
 * @return {Promise}     a Promise resolving to the new state of the record
 */
module.exports.update = (id, updates) => {
	return getState(id)
		.then((state) => { return objHelpers.update(state, updates); })
		.then((updatedState) => { return db.update(id, updatedState); });
};
