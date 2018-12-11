'use strict';

// var fs = require('fs');
var databaseFacade = new (require('./MockDB.js'))();
var jsonHelpers = require('./helpers/jsonHelpers.js');

/**
* Primary class. Instantiating creates a Tamagotchi object
**/



/**
* === Privately scoped Functions ===
**/ 

/**
 * increment(id, modifiers)	Updates Tamagotchi[{id}] internal state by a certain set of {modifiers}
 * @param  {int} 	 ID of Tamagotchi
 * @param  {obj}	 Flat JSON object of existing state
 * @param  {obj}	 Flat JSON object of keys to increment via value
 * @return {Promise} 
 */
function increment(id, state, modifiers) {
	return databaseFacade.update(id, jsonHelpers.incrementJSON(state, modifiers));
}

function get(id) {
	return databaseFacade.get(id);
}

function die(id) {
	if(__state.heartbeat !== null) {
		clearInterval(__state.heartbeat);
		__state.heartbeat = null;
		return({message: 'Your Tamagotchi has died!'});
	}
	else 
		return({message: 'Your Tamagotchi was already dead!'});
}

function poop(id, cb) { 
	return get(id)
		.then((state) => { 
			state.bladder = 0;
			return state;
		})
		.then((updatedState) => { databaseFacade.update(id, updatedState); })
		.then((newState) => { cb({'type':'poop'}); return newState; });
}

function sleep(id) {

}

function checkForDeath(state) {
	return (state.hunger >= 100 || state.age >= 100);
}

function isExhausted(state) {
	return (state.tiredness >= 80);
}

function isAwake(state) {
	return state.isAwake;
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


var __rules = {
	death: 		(state) => { return (state.hunger >= 100 || state.age >= 100) },
	exhaustion: (state) => { return (state.tiredness >= 80) },
	poop: 		(state) => { return (state.bladder > 20) },
	wake: 		(state) => { return (state.tiredness <= 0) } 
}


// Note: Only one Tamagotchi of ID 1, yet coded to be extensible in the future.
module.exports = class Tamagotchi {

	constructor(eventCallback) {
		__state.heartbeat = setInterval(() => { 
			get(1)
				.then((state) => { return increment( 1, state, __updateModifiers); })
				.then((state) => { return (checkForDeath(state) ? die(1, eventCallback) : state); })
				.then((state) => { return (isExhausted(state) ? sleep(1, eventCallback) : state); })
				.then((state) => { return (__rules.poop(state) ? poop(1, eventCallback) : state); })
		}, 1000 );
	}

	feed() {
		return increment(1, {'hunger':-25});
	}

	putToBed() {
		return increment(1, {'isSleeping':true});
	}

	murder() {
		return die(1);
	}

	getStats() {
		return get(1);
	}

	rename(name) {
		return databaseFacade.update(id, newState);	
	}
}