'use strict';

// var fs = require('fs');
var databaseFacade = new (require('./MockDB.js'))();

/**
* Primary class. Instantiating creates a Tamagotchi object
* 
* Note on promises -> Because this implementation is synchronous, the promises are not technically required. 
*    These are included with a view for async server implementation.
**/



/**
* === Privately scoped Functions ===
**/ 

/**
* update()
* 
* inputs: {id} of Tamagotchi to update, {modifiers} a set of parameters to be modified
* returns: Promise
**/

function update(id, modifiers) {
	//TODO: Unsafe - Not async ready - Not idempotent.
	//console.log(id, modifiers);

	return databaseFacade.get(id)
		.then((state) => {
			var result = state;
			//console.log(Object.keys(state), Object.keys(modifiers));
			Object.keys(state).forEach((key) => {
				//console.log(modifiers[key], state[key]);
				// TODO: check for empty object. Assumes that the 
				if(modifiers[key] && modifiers[key] !== null) 
					result[key] = state[key] + modifiers[key];
			})
			return result;
		})
		.then((newState) => { return databaseFacade.update(id, newState) });
}

function get(id) {
	//console.log('get(', id, ')');
	return databaseFacade.get(id).then((res) => {
		//console.log('response: ', res);
		return res;
	});
}

function sleep(id) {

}

function die(id) {
	return new Promise((resolve, reject) => {
		if(__state.heartbeat !== null) {
			__state.heartbeat = null;
			clearInterval(__state.heartbeat);
			resolve({message:__state.name + ' has died!'});
		}
		else 
			reject({message:__state.name + ' was already dead!'});
	});
}


/**
* Privately scoped state
**/
var __state = {
	'heartbeat':null
};


/**
* Business Rules
* Rate of change for Tamagotchi on each heartbeat
**/
const __updateModifiers = {
	'hunger':0.5,
	'tiredness':0.5,
	'bladder':0.5,
	'age':0.01
}

// Note: Only one Tamagotchi of ID 1, yet coded to be extensible in the future.
module.exports = class Tamagotchi {

	constructor() {
		__state.heartbeat = setInterval( () => { 
			update(1, __updateModifiers ); 
		}, 1000 );
	}

	feed() {
		return update(1, {'hunger':-25});
	}

	putToBed() {
		return update(1, {'isSleeping':true});
	}

	murder() {
		return die(1);
	}

	getStats() {
		return get(1);
	}
}