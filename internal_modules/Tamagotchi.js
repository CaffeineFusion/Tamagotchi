'use strict';

// var fs = require('fs');
// var db = new (require('./MockDB.js'))();
var db = require('./dbFacade.js');
var objHelpers = require('./helpers/objHelpers.js');
var stateHandlers = require('./stateHandlers.js');

/**
* Business Rules
* Rate of change for Tamagotchi on each heartbeat
**/

// modifiers - rates of change per tick given certain trigger
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


module.exports = class Tamagotchi {

	constructor(eventCallback) {
		this.callback = eventCallback;
		this.rules = rules;
		this.heartbeat = {};
	}

	/**
	 * initialise - Initialise internal state (async DB call), then initiate game loop (heartbeat)
	 * @param  {function} cb eventhandler to catch errors/messages
	 * @return {Promise}     a Promise resolving to the Tamagotchi instance
	 */
	initialise(cb) {
		var self = this;			

		return stateHandlers.birth(db, defaultState)
			.then((state) => {
				self.heartbeat = setInterval(() => { 
					stateHandlers.tick(db, self.heartbeat, rules, modifiers, self.callback);		
				}, 1000 );
				return state;
			})
			.then(() => { return self; })
			.catch(cb);
	}

	/**
	 * feed - attempt to feed Tamagotchi. Fail if dead or not hungry.
	 * @param  {function} cb eventhandler to handle errors/messages
	 * @return {Promise}     a Promise resolving to new internal state
	 *
	 * TODO: Refactor - simplify flow, extract code duplication, fix return state. Consider changing return type to Tamagotchi instance for chaining.
	 */
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

	/**
	 * putToBed - attempt to put Tamagotchi to bed. Fail if dead.
	 * @param  {Function} cb eventhandler to handle errors/messages
	 * @return {Promise}     a Promise resolving to new internal state
	 *
	 * TODO: Handle for already sleeping.
	 */
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

	/**
	 * awaken - attempt to wake Tamagotchi. Fail if dead.
	 * @param  {Function} cb eventhandler to handle errors/messages
	 * @return {Promise}     a Promise resolving to new internal state
	 */
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

	/**
	 * murder - brutally kill Tamagotchi. Override health, trigger death sequence
	 * @param  {Function} cb eventhandler to handle errors/messages
	 * @return {Promise}     a Promise resolving to new internal state
	 */
	murder(cb) {
		return db.update(1, {'health' : 0})
			.then(() => { return stateHandlers.die(db, 1, (res) => { cb({'type':'murder'}); }); })
			.catch(cb);
	}

	/**
	 * getStats - retrieve internal state of Tamagotchi
	 * @return {Promise}     a Promise resolving to the internal state
	 */
	getStats() {
		return db.getState(1);
	}

	/**
	 * rename - attempt to rename Tamagotchi
	 * @param  {string} name new name for Tamagotchi
	 * @return {Promise}     a Promise resolving to new internal state
	 *
	 * TODO: Add interface in server.js, add safe input checking.
	 */
	rename(name) {
		return db.update(1, {'name' : name});
	}


	// For testing purposes 
	pause() {
		clearInterval(this.heartbeat);
		this.heartbeat = null;
	}

	unpause() {
		var self = this;	
		self.heartbeat = setInterval(() => { 
			stateHandlers.tick(db, self.heartbeat, rules, modifiers, self.cb);
		}, 1000 );
	}
};