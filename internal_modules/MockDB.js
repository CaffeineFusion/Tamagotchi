'use strict'

/**
* Mock DB - Basic JSON objects represents Data Object. 
* DB would be expanded out to an external data source.
* 
**/

var database = {
	//'tamigotchis': [
	//	{
			'id':1,
			'name':'',
			'health':100,
			'hunger':0,
			'tiredness':0,
			'bladder':0,
			'age':0
	//	}
	//]
};



module.exports = class MockDB {

	constructor() {
	}

	get(id = 1) {
		return new Promise((resolve, reject) => {
			if(database) resolve(database);
			else reject({'message':'No Tamgotchi ' + id + ' found!'});
		});
	}

	update(id = 1, d) {
		return new Promise((resolve, reject) => {
			//TODO: Dangerous. Implement write locking/queueing?
			database = d;
			resolve(database);
		});
	}
}