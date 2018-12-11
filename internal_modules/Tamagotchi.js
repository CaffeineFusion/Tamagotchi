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

function getState(id) {
	return databaseFacade.get(id);
}

function birth(defaultState) {
	return databaseFacade.create(defaultState);
}

function die(id, cb) {
	if(__state.heartbeat !== null) {
		clearInterval(__state.heartbeat);
		__state.heartbeat = null;
		cb({'type':'death', 'message':'Your Tamagotchi has died'});
		return({success: true, 'message':'Your Tamagotchi has died'});
	}
	return({success: false, message: 'Your Tamagotchi was already dead!'});
}

function poop(id, cb) { 
	return getState(id)
		.then((state) => { 
			state.bladder = 0;
			return state;
		})
		.then((updatedState) => { return databaseFacade.update(id, updatedState); })
		.then((newState) => { 
			cb({'type':'poop'}); 
			return newState; 
		});
}

function sleep(id, cb) {
	return getState(id)
		.then((state) => { 
			state.awake = false;
			return state;
		})
		.then((updatedState) => { return databaseFacade.update(id, updatedState); })
		.then((newState) => { 
			cb({'type':'sleep'}); 
			return newState; 
		});
}

function wake(id, cb) {
	return getState(id)
		.then((state) => { 
			state.awake = true;
			return state;
		})
		.then((updatedState) => { return databaseFacade.update(id, updatedState); })
		.then((newState) => { 
			cb({'type':'wake'}); 
			return newState; 
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
	'hunger':1,
	'tiredness':10,
	'bladder':1,
	'age':0.5
};

const __sleepModifier = {
	'tiredness':-5
};

const __defaultState = {'id':1,
	'name':'Tammy',
	'health':100,
	'hunger':0,
	'tiredness':0,
	'bladder':0,
	'age':0,
	'awake':true
};


/**
 * __rules - an object containing the business rules for Tamagotchi. These are a set of functions which test the object state for certain constraints.
 * @type {Object}
 */
var __rules = {
	death: 		(state) => { return (state.hunger >= 100 || state.age >= 100); },
	exhaustion: (state) => { return (state.tiredness >= 80 && state.awake == true); },
	poop: 		(state) => { console.log(state); return (state.awake == true && state.bladder > 20); },
	wake: 		(state) => { return (state.awake == false && (state.tiredness <= 0 || state.bladder > 80)); },
	notHungry:	(state) => { return (state.hunger <= 25 ); }
};


// Note: Only one Tamagotchi of ID 1, yet coded to be extensible in the future.
module.exports = class Tamagotchi {

	constructor(eventCallback) {
		birth(__defaultState)
			.then(() => {
				__state.heartbeat = setInterval(() => { 
					/**
					 * On tick: 1) Get current state. 2) Update state based on modifiers (take into accound sleep).
					 * 			Check for 3) Death, 4) Exhaustion, 5) Poop
					 */
					console.log('heartbeat');
					getState(1)
						.then((state) => { 
							//console.log(state);	
							let modifiers = jsonHelpers.deepCloneJSON(__updateModifiers);
							if(state.awake == false) modifiers.tiredness = __sleepModifier.tiredness;
							//if(__rules.wake(state)) this.awaken();
							return increment( 1, state, modifiers); 
						})
						.then((state) => { return (__rules.death(state) ? die(1, eventCallback) : state); })
						.then((state) => { return (__rules.wake(state) ? this.awaken(eventCallback) : state); })
						.then((state) => { return (__rules.exhaustion(state) ? sleep(1, eventCallback) : state); })
						.then((state) => { return (__rules.poop(state) ? poop(1, eventCallback) : state); });
				}, 1000 );
			});
		//.then(() => {console.log('constructed!', this, Object.keys(this), this.feed); });
	}

	feed(cb) {
		return getState(1)
			.then((state) => { return state.awake == false ? this.awaken() : state; })
			.then((state) => { 
				//If our Tamagotchi is not hungry, callback with a failure message.
				//Else, feed the Tamagotchi.
				if(__rules.notHungry(state))
					return cb({'type':'feed', 'success':false, 'message':'Your Tamagotchi is not hungry right now [hunger <= 25]'});

				return increment(1, state,  {'hunger':-25})
					.then(cb({'type':'feed', 'success':true, 'message':'Omnomnomnom'}));
			});
	}

	putToBed() {
		//return increment(1, getState(1), {'isSleeping':true});
	}

	awaken(cb) {
		return wake(1, cb);
	}

	murder() {
		return die(1, () => {});
	}

	getStats() {
		return getState(1);
	}

	rename(name) {
		//return databaseFacade.update(id, newState);	
	}
};