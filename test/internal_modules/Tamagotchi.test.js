'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var expect = chai.expect;

var Tamagotchi = require("../../internal_modules/Tamagotchi.js");

chai.use(chaiAsPromised);
chai.should();

const statusTemplate = {'hunger':0.5,
	'tiredness':0.5,
	'bladder':0.5,
	'age':0.01
}
const defaultTamagotchi = {'id':1,
	'name':'Tammy',
	'health':100,
	'hunger':0,
	'tiredness':0,
	'bladder':0,
	'age':0,
	'awake':true 
};

/**
 * var rules = {
	death: 		(state) => { return (state.health <= 0 || state.age >= 100); },
	dying: 		(state) => { return (state.hunger >= 100); },
	exhaustion: (state) => { return (state.tiredness >= 80 && state.awake == true); },
	poop: 		(state) => { return (state.awake == true && state.bladder > 20); },
	wake: 		(state) => { return (state.awake == false && (state.tiredness <= 0 || state.bladder > 80)); },
	notHungry:	(state) => { return (state.hunger <= 25 ); }
};
 */


describe('Tamagotchi.rules', function() {
	let tamagotchi = new Tamagotchi();
	tamagotchi.pause();
	describe('death', function() {
		it('health: Edge case, should not die on more than 0 health [0.5]', function() {
			let state = { 'health':0.5, 'age':0 };
			return assert(!tamagotchi.rules.death(state));
		});

		it('health: Death from health loss [0]', function() {
			let state = { 'health':0, 'age':0 };
			return assert(tamagotchi.rules.death(state));
		});

		it('health: Death from health loss [-0.5]', function() {
			let state = { 'health':-0.5, 'age':0 };
			return assert(tamagotchi.rules.death(state));
		});


		it('age: Edge case, should not die under 100 yrs [99.5]', function() {
			let state = { 'health':100, 'age':99.5 };
			return assert(!tamagotchi.rules.death(state));
		});

		it('age: Death from old age [100]', function() {
			let state = { 'health':100, 'age':100 };
			return assert(tamagotchi.rules.death(state));
		});

		it('age: Death from old age [100.5]', function() {
			let state = { 'health':100, 'age':100.5 };
			return assert(tamagotchi.rules.death(state));
		});

		it('age: Death from both health loss [0] and old age [100]', function() {
			let state = { 'health':0, 'age':100 };
			return assert(tamagotchi.rules.death(state));
		});

	});

	describe('dying', function() {
		it('hunger: Starts dying at Hunger = 100', function() {
			let state = { 'hunger':100};
			return assert(tamagotchi.rules.dying(state));
		});
		it('hunger: Is not dying below Hunger = 100 [99.5]', function() {
			let state = { 'hunger':99.5};
			return assert(!tamagotchi.rules.dying(state));
		});
		it('hunger: Is dying when Hunger > 100 [100.5]', function() {
			let state = { 'hunger':100.5};
			return assert(tamagotchi.rules.dying(state));
		});
		it('other states: Is unaffected by other health states', function () {
			let state = {'health':100,
				'hunger':0,
				'tiredness':101,
				'bladder':101,
				'age':101,
				'awake':false };
			return assert(!tamagotchi.rules.dying(state));
		});
	});


	describe('exhaustion', function() {
		it('tiredness: An awake Tamagotchi is exhausted when tiredness reaches 80', function() {
			let state = { 'tiredness':80, 'awake':true};
			return assert(tamagotchi.rules.exhaustion(state));
		});

		it('tiredness: An awake Tamagotchi is exhausted when tiredness exceeds 80 [80.5]', function() {
			let state = { 'tiredness':80.5, 'awake':true};
			return assert(tamagotchi.rules.exhaustion(state));
		});

		it('tiredness: An awake Tamagotchi is not exhausted below 80 [79.5]', function() {
			let state = { 'tiredness':79.5, 'awake':true};
			return assert(!tamagotchi.rules.exhaustion(state));
		});

		it('tiredness: An awake Tamagotchi is not exhausted below 80 [0]', function() {
			let state = { 'tiredness':0, 'awake':true};
			return assert(!tamagotchi.rules.exhaustion(state));
		});

		it('tiredness: An awake Tamagotchi is not exhausted below 80 [-0.5]', function() {
			let state = { 'tiredness':-0.5, 'awake':true};
			return assert(!tamagotchi.rules.exhaustion(state));
		});

		it('awake: An asleep Tamagotchi is not considered exhaused [80]', function() {
			let state = { 'tiredness':80, 'awake':false};
			return assert(!tamagotchi.rules.exhaustion(state));
		});
	});

	describe('poop', function() {
		it('bladder: An awake Tamagotchi will poop when bladder exceeds 20 [20.5]', function() {
			let state = { 'bladder':20.5, 'awake':true};
			return assert(tamagotchi.rules.poop(state));
		});

		it('bladder: An awake Tamagotchi will not poop while bladder is at or below 20 [20]', function() {
			let state = { 'bladder':20, 'awake':true};
			return assert(!tamagotchi.rules.poop(state));
		});

		it('bladder: An awake Tamagotchi will not poop while bladder is at or below 20 [-0.5]', function() {
			let state = { 'bladder':0, 'awake':true};
			return assert(!tamagotchi.rules.poop(state));
		});

		it('bladder: An asleep Tamagotchi will not poop, regardless of bladder [100]', function() {
			let state = { 'bladder':100, 'awake':false};
			return assert(!tamagotchi.rules.poop(state));
		});
	});

	//wake: 		(state) => { return (state.awake == false && (state.tiredness <= 0 || state.bladder > 80)); },
	
	describe('wake', function() {
		it('tiredness: A sleeping Tamagotchi will rouse if tiredness reaches 0', function() {
			let state = { 'tiredness':0, 'awake':false, 'bladder':0};
			return assert(tamagotchi.rules.wake(state));
		});

		it('tiredness: A sleeping Tamagotchi will rouse if tiredness reaches 0 [-0.5]', function() {
			let state = { 'tiredness':-0.5, 'awake':false, 'bladder':0};
			return assert(tamagotchi.rules.wake(state));
		});

		it('tiredness: A sleeping Tamagotchi will not rouse while tiredness is above 0 [0.5]', function() {
			let state = { 'tiredness':0.5, 'awake':false, 'bladder':0};
			return assert(!tamagotchi.rules.wake(state));
		});

		it('bladder: A sleeping Tamagotchi will rouse when bladder exceeds 80 [80.5]', function() {
			let state = { 'tiredness':50, 'awake':false, 'bladder':80.5};
			return assert(tamagotchi.rules.wake(state));
		});

		it('bladder: A sleeping Tamagotchi will not rouse when bladder has not exceeeded 80 [80]', function() {
			let state = { 'tiredness':50, 'awake':false, 'bladder':80};
			return assert(!tamagotchi.rules.wake(state));
		});

		it('awake: An awake Tamagotchi does not need to be roused', function() {
			let state = { 'tiredness':0, 'awake':true, 'bladder':80.5};
			return assert(!tamagotchi.rules.wake(state));
		});
	});

	//notHungry:	(state) => { return (state.hunger <= 25 ); }
	describe('notHungry', function() {
		it('hunger: A Tamagotchi will not be hungry when hunger <= 25 [25]', function() {
			let state = { 'hunger':25 };
			return assert(tamagotchi.rules.notHungry(state));
		});

		it('hunger: A Tamagotchi will not be hungry when hunger <= 25 [0]', function() {
			let state = { 'hunger':0 };
			return assert(tamagotchi.rules.notHungry(state));
		});

		it('hunger: A Tamagotchi will be hungry when hunger exceeds 25 [25.5]', function() {
			let state = { 'hunger':25.5 };
			return assert(!tamagotchi.rules.notHungry(state));
		});

		it('hunger: Hunger is not affected by sleep [25.5]', function() {
			let state = { 'hunger':25.5, 'awake':false };
			return assert(!tamagotchi.rules.notHungry(state));
		});
	});
});


/*describe('Tamagotchi.update()', function() {

	it('Should update the Tamagotchi state by a given amount', function() {
		var expectedOutput = {'id':1,
			'name':'Tammy',
			'health':100,
			'hunger':0.5,
			'tiredness':0.5,
			'bladder':0.5,
			'age':0.01,
			'awake':true };

		return expect(Tamagotchi.update().should.eventually.deep.equal(expectedOutput));
	});
});*/
