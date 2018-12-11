'use strict';

/**
* DBFacade - seperate implementation of datastore from business logic.
**/

var objHelpers = require('./helpers/objHelpers.js');
var db = new (require('./MockDB.js'))();

module.exports.increment = (id, state, modifiers) => {
	return db.update(id, objHelpers.increment(state, modifiers));
};

var getState = (id) => {
	return db.get(id);
};
module.exports.getState = getState;

module.exports.birth = (defaultState) => {
	return db.create(defaultState);
};

module.exports.set = (id, updates) => {
	return getState(id)
		.then((state) => { return objHelpers.update(state, updates); })
		.then((updatedState) => { return db.update(id, updatedState); });
};
