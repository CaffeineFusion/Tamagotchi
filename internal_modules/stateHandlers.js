'use strict';

/**
* These helper functions perform a transformation of the Tamagotchi's internal state.
*
* Initially these were privately scoped functions within Tamagotchi.js
* However, this made them inaccessible to the test runner.
*
* Rather than exposing these private functions, or creating a temporary testing backdoor into the internal state of the main class, I pulled them out into this file.
* 
**/ 


var objHelpers = require('./helpers/objHelpers.js');


module.exports.birth = (db, defaultState) => {
	return db.create(defaultState);
};


var die = module.exports.die = (db, id, heartbeat, cb) => {
	if(heartbeat !== null) {
		clearInterval(heartbeat);
		heartbeat = null;
		cb({'type':'death', 'message':'Your Tamagotchi has died'});
		return ({success: true, 'message':'Your Tamagotchi has died'});
	}
	return ({success: false, message: 'Your Tamagotchi was already dead!'});
};

var poop = module.exports.poop = (db, id, cb) => { 
	return db.update(id, {'bladder' : 0})
		.then((newState) => { 
			cb({'type':'poop'}); 
			return newState; 
		});
};

var sleep = module.exports.sleep = (db, id, cb) => {
	//console.log('sleep', db, id, cb);
	return db.update(id, {'awake' : false})
		.then((newState) => { 
			cb({'type':'sleep', 'message':'Your Tamagotchi has fallen asleep'}); 
			return newState; 
		});
};

var wake = module.exports.wake = (db, id, cb) => {
	return db.update(id, {'awake' : true})
		.then((newState) => { 
			cb({'type':'wake', 'message':'Your Tamagotchi has woken up'}); 
			return newState; 
		});
};

module.exports.tick = (db, heartbeat, rules, modifiers, eventCallback) => {
	/**
	 * On tick: 1) Get current state. 2) Update state based on modifiers (take into accound sleep).
	 * 			Check for 3) Death, 4) Exhaustion, 5) Poop
	 */
	//console.log(db, rules, modifiers, eventCallback);
	//console.log(db.getState(1));
	return db.getState(1)
		.then((state) => { 
			let updates = objHelpers.deepClone(modifiers.update);
			if(state.awake == false) updates.tiredness = modifiers.sleep.tiredness;
			if(rules.dying(state)) {
				updates.health = modifiers.dying.health;
				eventCallback({'type':'dying'});
			}
			//if(__rules.wake(state)) this.awaken();
			return db.increment( 1, state, updates); 
		})
		.then((state) => { 		
			if(rules.death(state)) {
				die(db, 1, heartbeat, eventCallback); 
				throw({'type':'updateLoopTermination'}); // Break from update loop.
			}
			return state;
		})
		.then((state) => { return (rules.wake(state) ? wake(db, 1, eventCallback) : state); })
		.then((state) => { return (rules.exhaustion(state) ? sleep(db, 1, eventCallback) : state); })
		.then((state) => { return (rules.poop(state) ? poop(db, 1, eventCallback) : state); })
		.catch(eventCallback);
};
