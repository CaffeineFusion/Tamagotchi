'use strict';

/**
 * Please See MockDB.test.js, helpers/jsonHelers.test.js or Tamagotchi.test.js for examples of finished tests.
 */


var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

var stateHandlers = require("../../internal_modules/stateHandlers.js");

const statusTemplate = {'hunger':0.5,
	'tiredness':0.5,
	'bladder':0.5,
	'age':0.01
};
const defaultTamagotchi = {'id':1,
	'name':'Tammy',
	'health':100,
	'hunger':0,
	'tiredness':0,
	'bladder':0,
	'age':0,
	'awake':true 
};
const alternateTamagotchi = {'id':1,
	'name':'Fred',
	'health':50,
	'hunger':50,
	'tiredness':50,
	'bladder':50,
	'age':50,
	'awake':false 
};


// birth (db, state); die(db, id, heartbeat, cb); poop(db, id, cb); sleep(db, id, cb); wake(db, id, cb); tick(db, heartbeat, rules, modifiers, eventCallback);

describe('stateHandlers', function() {
	
	it('TODO: Write tests for stateHandlers', function() {
		return assert(true == false); // Todo item. Throw alert.
	});

	/*
		module.exports.birth = (db, defaultState) => {
			return db.create(defaultState);
		};
	 */

	describe('birth', function() {

	});

	describe('die', function() {

	});

	describe('poop', function() {

	});

	describe('sleep', function() {

	});

	describe('wake', function() {

	});

	describe('tick', function() {

	});
});





/*var die = module.exports.die = (db, id, heartbeat, cb) => {
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
};*/