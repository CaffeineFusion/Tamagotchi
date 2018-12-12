'use strict';

// var fs = require('fs');
// var db = new (require('./MockDB.js'))();
var db = require('./dbFacade.js');
var objHelpers = require('./helpers/objHelpers.js');
var stateHandlers = require('./stateHandlers.js');

/**
* Primary class. Instantiating creates a Tamagotchi object
**/


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
/*
const updateModifiers = {
	'hunger':2,
	'tiredness':10,
	'bladder':2,
	'age':0.5
};

const sleepModifier = {
	'tiredness':-5
};

const dyingModifier = {
	'health':-5
};
*/

const modifiers = {
	update: {
		'hunger':2,
		'tiredness':5,
		'bladder':2,
		'age':0.5
	},
	sleep: {
		'tiredness':-5
	},
	dying: {
		'health':-5
	}
};

const defaultState = {'id':1,
	'name':'Tammy',
	'health':100,
	'hunger':0,
	'tiredness':0,
	'bladder':0,
	'age':0,
	'awake':true
};


/**
 * rules - an object containing the business rules for Tamagotchi. These are a set of functions which test the object state for certain constraints.
 * @type {Object}
 */
var rules = {
	death: 		(state) => { return (state.health <= 0 || state.age >= 100); },
	dying: 		(state) => { return (state.hunger >= 100); },
	exhaustion: (state) => { return (state.tiredness >= 80 && state.awake == true); },
	poop: 		(state) => { return (state.awake == true && state.bladder > 20); },
	wake: 		(state) => { return (state.awake == false && (state.tiredness <= 0 || state.bladder > 80)); },
	notHungry:	(state) => { return (state.hunger <= 25 ); }
};


/**
* === Privately scoped Functions ===
**/ 
/**
function birth(defaultState) {
	return dbFacade.create(defaultState);
}


function die(id, cb) {
	if(__state.heartbeat !== null) {
		clearInterval(__state.heartbeat);
		__state.heartbeat = null;
		cb({'type':'death', 'message':'Your Tamagotchi has died'});
		return ({success: true, 'message':'Your Tamagotchi has died'});
	}
	return ({success: false, message: 'Your Tamagotchi was already dead!'});
}

function poop(id, cb) { 
	return dbFacade.update(id, {'bladder' : 0})
		.then((newState) => { 
			cb({'type':'poop'}); 
			return newState; 
		});
}

function sleep(id, cb) {
	return dbFacade.update(id, {'awake' : false})
		.then((newState) => { 
			cb({'type':'sleep', 'message':'Your Tamagotchi has fallen asleep'}); 
			return newState; 
		});
}

function wake(id, cb) {
	return dbFacade.update(id, {'awake' : true})
		.then((newState) => { 
			cb({'type':'wake', 'message':'Your Tamagotchi has woken up'}); 
			return newState; 
		});
}

function tick(eventCallback) {
	//console.log('heartbeat');
	return dbFacade.getState(1)
		.then((state) => { 
			let modifiers = objHelpers.deepClone(updateModifiers);
			if(state.awake == false) modifiers.tiredness = sleepModifier.tiredness;
			if(rules.dying(state)) {
				modifiers.health = dyingModifier.health;
				eventCallback({'type':'dying'});
			}
			//if(__rules.wake(state)) this.awaken();
			return dbFacade.increment( 1, state, modifiers); 
		})
		.then((state) => { 		
			if(rules.death(state)) {
				die(1, eventCallback); 
				throw({'type':'updateLoopTermination'}); // Break from update loop.
			}
			return state;
		})
		.then((state) => { return (rules.wake(state) ? wake(1, eventCallback) : state); })
		.then((state) => { return (rules.exhaustion(state) ? sleep(1, eventCallback) : state); })
		.then((state) => { return (rules.poop(state) ? poop(1, eventCallback) : state); })
		.catch(eventCallback);
}**/



// Note: Only one Tamagotchi of ID 1, yet coded to be extensible in the future.
module.exports = class Tamagotchi {

	constructor(eventCallback) {
		this.callback = eventCallback;
		stateHandlers.birth(db, defaultState)
			.then(() => {
				__state.heartbeat = setInterval(() => { 
					stateHandlers.tick(db, __state.heartbeat, rules, modifiers, eventCallback);
				}, 1000 );
			});
		//.then(() => {console.log('constructed!', this, Object.keys(this), this.feed); });
	}

	feed(cb) {	//Refactor into a more functional pattern
		return db.getState(1)
			.then((state) => {
				if(rules.death(state)) 
					throw({'type':'feed', 'success':false, 'message':'Your Tamagotchi has died! We can not feed it!'}); 
				return state;
			})
			.then((state) => { return state.awake == false ? this.awaken(cb) : state; })	// Refactor with subhandler for callback. {cb} sufficient for now.
			.then((state) => { 
				//If our Tamagotchi is not hungry, callback with a failure message.
				//Else, feed the Tamagotchi.
				if(rules.notHungry(state))
					return cb({'type':'feed', 'success':false, 'message':'Your Tamagotchi is not hungry right now [hunger <= 25]'});

				return db.increment(1, state,  {'hunger':-25})
					.then(cb({'type':'feed', 'success':true, 'message':'Omnomnomnom'}));
			})
			.catch(cb);
	}

	putToBed(cb) {
		return db.getState(1)
			.then((state) => {
				if(rules.death(state)) 
					throw({'type':'putToBed', 'success':false, 'message':'Your Tamagotchi has died! We can not put it to bed!'}); 
				return state;
			})
			.then(() => { return stateHandlers.sleep(db, 1, cb); })
			.catch(cb);
	}

	awaken(cb) {
		return db.getState(1)
			.then((state) => {
				if(rules.death(state)) 
					throw({'type':'wake', 'success':false, 'message':'Your Tamagotchi has died! We can not wake it up!'}); 
				return state;
			})
			.then((state) => { return stateHandlers.wake(db, 1, cb); })
			.catch(cb);
	}

	murder(cb) {
		return db.update(1, {'health' : 0})
			.then(() => { return stateHandlers.die(db, 1, (res) => { cb({'type':'murder'}); }); })
			.catch(cb);
	}

	getStats() {
		return db.getState(1);
	}

	rename(name) {
		return db.update(1, {'name' : name});
	}


	// For testing purposes 
	pause() {
		clearInterval(__state.heartbeat);
		__state.heartbeat = null;
	}

	unpause() {
		var cb = this.callback;
		__state.heartbeat = setInterval(() => { 
			stateHandlers.tick(db, __state.heartbeat, rules, modifiers, cb);
		}, 1000 );
	}
};