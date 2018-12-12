'use strict';

// var fs = require('fs');
// var db = new (require('./MockDB.js'))();
var dbFacade = require('./dbFacade.js');
var objHelpers = require('./helpers/objHelpers.js');

/**
* Primary class. Instantiating creates a Tamagotchi object
**/



/**
* === Privately scoped Functions ===
**/ 


function birth(defaultState) {
	return dbFacade.create(defaultState);
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
	'hunger':20,
	'tiredness':10,
	'bladder':2,
	'age':0.5
};

const __sleepModifier = {
	'tiredness':-5
};

const __dyingModifier = {
	'health':-5
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
	death: 		(state) => { return (state.health <= 0 || state.age >= 100); },
	dying: 		(state) => { return (state.hunger >= 100); },
	exhaustion: (state) => { return (state.tiredness >= 80 && state.awake == true); },
	poop: 		(state) => { return (state.awake == true && state.bladder > 20); },
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
					//console.log('heartbeat');
					dbFacade.getState(1)
						.then((state) => { 
							//console.log(state);	
							let modifiers = objHelpers.deepClone(__updateModifiers);
							if(state.awake == false) modifiers.tiredness = __sleepModifier.tiredness;
							if(__rules.dying(state)) {
								modifiers.health = __dyingModifier.health;
								eventCallback({'type':'dying'});
							}
							//if(__rules.wake(state)) this.awaken();
							return dbFacade.increment( 1, state, modifiers); 
						})
						.then((state) => { return (__rules.death(state) ? die(1, eventCallback) : state); })
						.then((state) => { return (__rules.wake(state) ? wake(1, eventCallback) : state); })
						.then((state) => { return (__rules.exhaustion(state) ? sleep(1, eventCallback) : state); })
						.then((state) => { return (__rules.poop(state) ? poop(1, eventCallback) : state); });
				}, 1000 );
			});
		//.then(() => {console.log('constructed!', this, Object.keys(this), this.feed); });
	}

	feed(cb) {
		return dbFacade.getState(1)
			.then((state) => {
				if(__rules.death(state)) 
					throw({'type':'feed', 'success':false, 'message':'Your Tamagotchi has died! We can not feed it!'}); 
			})
			.then((state) => { return state.awake == false ? this.awaken(cb) : state; })	// Refactor with subhandler for callback. {cb} sufficient for now.
			.then((state) => { 
				//If our Tamagotchi is not hungry, callback with a failure message.
				//Else, feed the Tamagotchi.
				if(__rules.notHungry(state))
					return cb({'type':'feed', 'success':false, 'message':'Your Tamagotchi is not hungry right now [hunger <= 25]'});

				return dbFacade.increment(1, state,  {'hunger':-25})
					.then(cb({'type':'feed', 'success':true, 'message':'Omnomnomnom'}));
			})
			.catch(cb);
	}

	putToBed(cb) {
		return dbFacade.update(1, {'awake' : false})
			.then((state) => {
				if(__rules.death(state)) 
					throw({'type':'putToBed', 'success':false, 'message':'Your Tamagotchi has died! We can not put it to bed!'}); 
			})
			.catch(cb);
	}

	awaken(cb) {
		return wake(1, cb)
			.then((state) => {
				if(__rules.death(state)) 
					throw({'type':'wake', 'success':false, 'message':'Your Tamagotchi has died! We can not wake it up!'}); 
			})
			.catch(cb);;
	}

	murder(cb) {
		return die(1, (res) => { cb({'type':'murder'}); });
	}

	getStats() {
		return dbFacade.getState(1);
	}

	rename(name) {
		return dbFacade.update(1, {'name' : name});
		/*return getState(1)
			.then((state) => { state.name = name; return state; })
			.then((newState) => { return db.update(1, newState); });	*/
	}
};