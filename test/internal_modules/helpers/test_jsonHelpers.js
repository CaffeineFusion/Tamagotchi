'use strict';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var jsonHelpers = require('../../../internal_modules/helpers/objHelpers.js');

chai.should();

describe('increment', function() {



});

describe('deepClone', function() {

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


