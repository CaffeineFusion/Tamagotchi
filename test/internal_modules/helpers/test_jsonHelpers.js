'use strict';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var jsonHelpers = require('../../../internal_modules/helpers/objHelpers.js');

chai.should();

let basicState = {'id':1,
	'name':'Tammy',
	'health':100,
	'hunger':0,
	'tiredness':0,
	'bladder':0,
	'age':0,
	'awake':true};


describe('jsonHelpers.deepClone()', function() {
	//deepClone(a) => result

	it('Should deep clone an existing object - functions out-of-scope', function() {
		let input = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};
		let expectedOutput = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};

		return expect(jsonHelpers.deepClone(input).should.deep.equal(expectedOutput));
	});

	it('Created object should not be affected by updates to the predecessor', function() {
		let input = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};
		let expectedOutput = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};
		let output = jsonHelpers.deepClone(input);
		input.test = 2;

		return expect(output.should.deep.equal(expectedOutput));
	});

	it('Updates to created object should not affect predecessor', function () {
		let input = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};
		let expectedOutput = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};
		let output = jsonHelpers.deepClone(input);
		output.test = 2;

		return expect(input.should.deep.equal(expectedOutput));
	});
});


//Increment Set A by Set B
describe('jsonHelpers.increment()', function() {
	//increment(a,b) => result

	it('Should add positive integers', function() {
		let modifiers = {'age':1};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		expectedOutput.age = 1;
		return expect(jsonHelpers.increment(basicState, modifiers).should.deep.equal(expectedOutput));
	});

	it('Should add negative integers', function() {
		let modifiers = {'age':-1};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		expectedOutput.age = -1;
		return expect(jsonHelpers.increment(basicState, modifiers).should.deep.equal(expectedOutput));
	});

	it('Should handle multiple changes', function() {
		let modifiers = {'age':1, 'health':-25};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		expectedOutput.age = 1;
		expectedOutput.health = 75;
		return expect(jsonHelpers.increment(basicState, modifiers).should.deep.equal(expectedOutput));
	});

	it('Should handle 0 increases', function() {
		let modifiers = {'health':0};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		return expect(jsonHelpers.increment(basicState, modifiers).should.deep.equal(expectedOutput));
	});

	// Note: other decimals are out of scope for this demo. Small decimals will run into issues with Javascripts base number type.
	it('Should handle 0.5 increases', function() {
		let modifiers = {'age':0.5};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		expectedOutput.age = 0.5;
		return expect(jsonHelpers.increment(basicState, modifiers).should.deep.equal(expectedOutput));
	});

	it('No keys should be lost through the operation.', function() {
		return expect(jsonHelpers.increment(basicState, {}).should.deep.equal(basicState));
	});


});


//Update Set A with the values of Set B
//Todo: Add Testing for parameter overrun.
describe('jsonHelpers.update()', function() {
	//update(a,b) => result

	it('Should handle positive integers', function() {
		let modifiers = {'health':15};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		expectedOutput.health = 15;
		return expect(jsonHelpers.update(basicState, modifiers).should.deep.equal(expectedOutput));
	});

	it('Should handle negative integers', function() {
		let modifiers = {'health':-15};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		expectedOutput.health = -15;
		return expect(jsonHelpers.update(basicState, modifiers).should.deep.equal(expectedOutput));
	});


	it('Should handle booleans', function() {
		let modifiers = {'awake':false};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		expectedOutput.awake = false;
		return expect(jsonHelpers.update(basicState, modifiers).should.deep.equal(expectedOutput));
	});

	it('Should handle strings', function() {
		let modifiers = {'cheese':'Omnomnom'};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		expectedOutput.cheese = 'Omnomnom';
		return expect(jsonHelpers.update(basicState, modifiers).should.deep.equal(expectedOutput));
	});


	it('Should handle multiple updates', function() {
		let modifiers = {'age':15, 'health':-25};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		expectedOutput.age = 15;
		expectedOutput.health = -25;
		return expect(jsonHelpers.update(basicState, modifiers).should.deep.equal(expectedOutput));
	});

	// Note: other decimals are out of scope for this demo. Small decimals will run into issues with Javascripts base number type.
	it('Should handle 0.5 increases', function() {
		let modifiers = {'age':0.5};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		expectedOutput.age = 0.5;
		return expect(jsonHelpers.update(basicState, modifiers).should.deep.equal(expectedOutput));
	});

	it('Should handle new Parameter', function() {
		let modifiers = {'cheese':1};
		let expectedOutput = jsonHelpers.deepClone(basicState);
		expectedOutput.cheese = 1;
		return expect(jsonHelpers.update(basicState, modifiers).should.deep.equal(expectedOutput));
	});

	it('No keys should be lost through the operation.', function() {
		return expect(jsonHelpers.update(basicState, {}).should.deep.equal(basicState));
	});
});
